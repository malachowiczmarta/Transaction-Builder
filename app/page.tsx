'use client';
import Card from '@/components/Card/Card';
import { Input, InputStatus } from '@/components/ui/input';
import useInput from '@/utils/useInput';
import isValidENSName from '@/utils/validateENSName';
import { validateWalletAddress } from '@/utils/validateWalletAddress';
import { useEffect, useMemo, useState } from 'react';
import { fetchEnsAddress } from '@wagmi/core';
import { Textarea } from '@/components/ui/textarea';
import ValidationText from '@/components/ValidationText/ValidationText';
import { toast } from '@/components/ui/useToast';
import { ethers, Interface } from 'ethers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type InputHelper = {
  text: string;
  status: InputStatus;
};

export default function Home() {
  const { value, bindings } = useInput('');

  const [abi, setAbi] = useState([]);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isLoadingAbi, setIsLoadingAbi] = useState(false);
  const [contractMethods, setContractMethods] = useState<ethers.FunctionFragment[] | []>([]);
  const [selectedMethod, setSelectedMethod] = useState<ethers.FunctionFragment | undefined>(
    undefined
  );

  const [validatedAddress, setValidatedAddress] = useState('');

  const createMethodArr = (iface: ethers.Interface) => {
    const arr: ethers.FunctionFragment[] = [];
    iface.forEachFunction((f) => {
      arr.push(f);
    });
    console.log(arr);
    return arr;
  };
  const onSelect = (value: string) => {
    const selectedMethods = contractMethods.find((m) => m.selector === value);
    console.log(selectedMethods);
    setSelectedMethod(selectedMethods);
  };

  const fetchAbi = async (address: string) => {
    setIsLoadingAbi(true);
    try {
      fetch(`https://anyabi.xyz/api/get-abi/${1}/${address}`)
        .then((response) => response.json())
        .then((data) => {
          setAbi(data.abi);
        });
    } catch (error) {
      toast({
        title: 'Something went wrong.',
        description: 'Error fetching ABI',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingAbi(false);
    }
  };

  const fetchAddress = async (name: string) => {
    setIsLoadingAddress(true);
    try {
      const address = (await fetchEnsAddress({
        name: name
      })) as string;
      setValidatedAddress(address);
    } catch (error) {
      toast({
        title: 'Something went wrong.',
        description: `Error fetching address for ENS name ${name}:`,
        variant: 'destructive'
      });
      console.error(`Error fetching address for ENS name ${name}:`, error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const addressOrABIHelper: InputHelper = useMemo(() => {
    setValidatedAddress('');
    if (!value)
      return {
        text: '',
        status: undefined
      };
    const isValidAddress = validateWalletAddress(value);
    const isValidENS = isValidENSName(value);
    if (isValidAddress) {
      setValidatedAddress(value);
    }
    if (isValidENS) {
      fetchAddress(value);
    }
    return {
      text: isValidAddress || isValidENS ? '' : 'Invalid wallet address',
      status: isValidAddress || isValidENS ? 'default' : 'error'
    };
  }, [value]);

  useEffect(() => {
    if (validatedAddress) fetchAbi(validatedAddress);
    if (!validatedAddress) setAbi([]);
  }, [validatedAddress]);

  useEffect(() => {
    const iface = new Interface(abi);
    setContractMethods(createMethodArr(iface));
  }, [abi]);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-8 mx-auto">
        <Card>
          <h1 className="text-2xl font-medium title-font text-gray-900 mb-3">New Transaction</h1>
          <form>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Address">
                Address or ENS name
              </label>
              <Input
                {...bindings}
                id="Address"
                type="text"
                placeholder="Enter address or ENS name"
                status={addressOrABIHelper.status}
                isLoading={isLoadingAddress}
              />
              <ValidationText text={addressOrABIHelper.text} />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="abi">
                ABI
              </label>
              <Textarea
                id="abi"
                rows={8}
                placeholder="Enter ABI"
                defaultValue={abi && abi.length > 0 ? JSON.stringify(abi, null, 2) : ''}
                status={undefined}
                isLoading={isLoadingAbi}
              />
              {/* <ValidationText text={helper.text} /> */}
            </div>
          </form>
        </Card>
        {abi && abi.length > 0 && (
          <Card>
            <h1 className="text-2xl font-medium title-font text-gray-900 mb-3">
              Transaction Information
            </h1>
            <form>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ToAddress">
                To Address
              </label>
              <Input
                id="ToAddress"
                type="text"
                placeholder="Enter address"
                status={addressOrABIHelper.status}
                isLoading={isLoadingAddress}
                defaultValue={validatedAddress}
              />
              <ValidationText text={addressOrABIHelper.text} />
              {contractMethods && contractMethods.length > 0 && (
                <Select onValueChange={onSelect}>
                  <SelectTrigger aria-label="contract method">
                    <SelectValue placeholder="Select contract method" />
                  </SelectTrigger>

                  <SelectContent>
                    {contractMethods.map((method) => (
                      <SelectItem value={method.selector} key={method.selector}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {selectedMethod &&
                selectedMethod.inputs &&
                selectedMethod.inputs.length > 0 &&
                selectedMethod.inputs.map((inp) => (
                  <div key={inp.name} className="mt-2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="ToAddress"
                    >
                      {inp.name}&nbsp;({inp.baseType})
                    </label>
                    <Input
                      id={inp.name}
                      type="text"
                      placeholder={`Enter ${inp.name}`}
                      // status={addressOrABIHelper.status}
                      // isLoading={isLoadingAddress}
                      // defaultValue={validatedAddress}
                    />
                  </div>
                ))}
            </form>
          </Card>
        )}
      </div>
    </section>
  );
}
