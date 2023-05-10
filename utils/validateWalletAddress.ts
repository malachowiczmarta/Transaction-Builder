import { ethers } from 'ethers';

export const validateWalletAddress = (address: string) => {
  if (!ethers.isAddress(address)) {
    return false;
  }
  return true;
};
