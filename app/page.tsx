'use client';
import Card from '@/components/Card/Card';
import { Input, InputStatus } from '@/components/ui/input';
import useInput from '@/utils/useInput';
import isValidENSName from '@/utils/validateENSName';
import { validateWalletAddress } from '@/utils/validateWalletAddress';
import { useMemo, useState } from 'react';
import { fetchEnsAddress } from '@wagmi/core';

type InputHelper = {
  text: string;
  status: InputStatus;
};

export default function Home() {
  const { value, reset, bindings } = useInput('');
  const [abi, setAbi] = useState([]);

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
      const address = fetchAddress(value);
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
              <p className="text-sm text-red-500 mt-1 ml-1">{helper.text}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                ABI
                <textarea
                  className="shadow font-normal form-textarea mt-1 block border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={5}
                  placeholder="Enter ABI"
                  defaultValue={abi.length > 0 ? JSON.stringify(abi) : ''}></textarea>
              </label>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}
