"use client";
import Card from "@/components/Card/Card";
import { Input, InputStatus } from "@/components/ui/input";
import useInput from "@/utils/useInput";
import isValidENSName from "@/utils/validateENSName";
import { validateWalletAddress } from "@/utils/validateWalletAddress";
import { useMemo } from "react";
import { useEnsAddress } from "wagmi";

type InputHelper = {
  text: string;
  status: InputStatus;
};

export default function Home() {
  const { value, reset, bindings } = useInput("");
  // const { data, isError, isLoading } = useEnsAddress({
  //   name: "hdjdeb.yth",
  // });

  const helper: InputHelper = useMemo(() => {
    if (!value)
      return {
        text: "",
        status: undefined,
      };
    const isValidAddress = validateWalletAddress(value);
    const isValidENS = isValidENSName(value);

    console.log(isValidAddress, isValidENS);
    return {
      text: isValidAddress || isValidENS ? "" : "Invalid wallet address",
      status: isValidAddress || isValidENS ? "default" : "error",
    };
  }, [value]);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-8 mx-auto">
        <Card>
          <h1 className="text-2xl font-medium title-font text-gray-900 mb-3">
            New Transaction
          </h1>
          <form>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="Address"
              >
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
                  className="shadow form-textarea mt-1 block border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={5}
                  placeholder="Enter ABI"
                ></textarea>
              </label>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}
