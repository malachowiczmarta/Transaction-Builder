'use client';
import Card from '@/components/Card/Card';
import { Input, InputStatus } from '@/components/ui/input';
import useInput from '@/utils/useInput';
import isValidENSName from '@/utils/validateENSName';
import { validateWalletAddress } from '@/utils/validateWalletAddress';
import { useMemo, useState } from 'react';
import { fetchEnsAddress } from '@wagmi/core';
import { Textarea } from '@/components/ui/textarea';
import ValidationText from '@/components/ValidationText/ValidationText';

type InputHelper = {
  text: string;
  status: InputStatus;
};

export default function Home() {
  const { value, reset, bindings } = useInput('');
  const [abi, setAbi] = useState([]);
  console.log(abi);
  const fetchAbi = async (address: string) => {
    const url = `https://anyabi.xyz/api/get-abi/${1}/${address}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log('fetchAbi', data);
        setAbi(data.abi);
      });
  };

  const fetchAddress = async (name: string) => {
    try {
      const address = (await fetchEnsAddress({
        name: name
      })) as string;
      fetchAbi(address);

      return address;
    } catch (error) {
      console.error(`Error fetching address for ENS name ${name}:`, error);
      throw error;
    } finally {
      console.log(`Completed fetching address for ENS name ${name}`);
    }
  };

  const helper: InputHelper = useMemo(() => {
    if (!value)
      return {
        text: '',
        status: undefined
      };
    const isValidAddress = validateWalletAddress(value);
    const isValidENS = isValidENSName(value);

    if (isValidAddress) {
      fetchAbi(value);
    }
    if (isValidENS) {
      fetchAddress(value)
        .then((address) => {
          fetchAbi(address);
        })
        .catch((error) => {
          console.error(`Error fetching address for ENS name ${value}:`, error);
        });
    }
    return {
      text: isValidAddress || isValidENS ? '' : 'Invalid wallet address',
      status: isValidAddress || isValidENS ? 'default' : 'error'
    };
  }, [value]);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-8 mx-auto">
        <Card>
          <h1 className="text-2xl font-medium title-font text-gray-900 mb-3">New Transaction</h1>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Address">
                Address or ENS name
              </label>
              <Input
                {...bindings}
                id="Address"
                type="text"
                placeholder="Enter address or ENS name"
                status={helper.status}
              />
              <ValidationText text={helper.text} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="abi">
                ABI
              </label>
              <Textarea
                id="abi"
                rows={8}
                placeholder="Enter ABI"
                defaultValue={abi && abi.length > 0 ? JSON.stringify(abi, null, 2) : ''}
                status={undefined}
              />
              {/* <ValidationText text={helper.text} /> */}
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}
