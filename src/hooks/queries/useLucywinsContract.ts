import { BetProposal } from '@/pages/LuckyWins/components/CurrentBet';
import LUCYWINS_ABI from '@/web3/abi/lucywins.json';

import useAlert from '@/hooks/useAlert';
import { useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useActiveWeb3React } from '@/web3/WalletProvider';

export const LUCYWINS_CONTRACT = '0x277E237C1c4CaB760f49Bb191bbc3167E4293464';
export { LUCYWINS_ABI };

export function useLuckywinsContract() {
  const { web3Provider } = useActiveWeb3React();
  const [luckywinsContract, setLucywinsContract] = useState<Contract | null>(null);
  const { setAlert } = useAlert();

  useEffect(() => {
    if (!web3Provider) {
      return;
    }
    const luckywinsContract = new Contract(
      LUCYWINS_CONTRACT,
      LUCYWINS_ABI,
      web3Provider.getSigner(),
    );
    setLucywinsContract(luckywinsContract);
  }, [web3Provider]);

  const buyTicket = async (buyTicketParams: Omit<BetProposal, 'betPrice'>[]) => {
    if (!luckywinsContract) {
      setAlert({ type: 'warning', message: 'Service not prepared' });
      return;
    }
    const estimateGas = await luckywinsContract.estimateGas.buyTickets(buyTicketParams);
    // const updatedGas = parseInt(Number(estimateGas) * 1.3 + '');
    const result = await luckywinsContract.buyTickets(buyTicketParams, {
      gasLimit: Number(estimateGas),
    });
    return result;
  };

  const claimCjc = async (ticketIds: number[]) => {
    if (!luckywinsContract) {
      setAlert({ type: 'warning', message: 'Service not prepared' });
      return;
    }

    const estimateGas = await luckywinsContract.estimateGas.claimTickets(ticketIds);
    // const updatedGas = parseInt(Number(estimateGas) * 1.3 + '');
    const result = await luckywinsContract.claimTickets(ticketIds, {
      gasLimit: Number(estimateGas),
    });
    return result;
  }

  return {
    buyTicket,
    luckywinsContract,
    claimCjc
  };
}
