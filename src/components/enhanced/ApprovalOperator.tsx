import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Contract } from '@ethersproject/contracts';
import { useActiveWeb3React } from '@/web3/WalletProvider';
import ERC20_ABI from '@/web3/abi/erc20.json';
import ERC721_ABI from '@/web3/abi/erc721.json';
import ERC1155_ABI from '@/web3/abi/erc1155.json';
import { Web3Provider } from '@ethersproject/providers';

interface ApprovalOperatorProps {
  targetAddress: string;
  operatorAddress: string;
  tokenType: 'ERC20' | 'ERC721' | 'ERC1155';
  approvedComponent?: JSX.Element;
  minApproveAmount?: number;
  allowText?: string | JSX.Element;
  customClass?: string;
  afterApproved?: (v: boolean) => void;
}

export const ABI_MAP = {
  ERC20: ERC20_ABI,
  ERC721: ERC721_ABI,
  ERC1155: ERC1155_ABI,
};
const TOKEN_NAME_MAP = {
  ERC20: 'Token',
  ERC721: 'Nft',
  ERC1155: 'Nft',
};
const APPROVE_AMOUNT =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const ApprovalOperator: React.FC<ApprovalOperatorProps> = ({
  targetAddress,
  operatorAddress,
  tokenType,
  allowText,
  approvedComponent,
  minApproveAmount = 0,
  afterApproved,
  customClass,
}) => {
  const { account, web3Provider } = useActiveWeb3React();
  const [tokenContract, setTokenContract] = useState<Contract | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const contract = new Contract(
        targetAddress,
        JSON.stringify(ABI_MAP[tokenType]),
        web3Provider.getSigner(),
      );
      setTokenContract(contract);
    }, 100);
  }, [targetAddress, tokenType]);

  useEffect(() => {
    getApprovement();
  }, [tokenContract]);

  const getApprovement = async () => {
    if (!tokenContract) {
      return;
    }
    if (tokenType === 'ERC20') {
      setTimeout(async () => {
        const tokenApproved = await tokenContract.allowance(account, operatorAddress);
        const _approvedAmount = Number(tokenApproved) / 1e18;
        setIsApproved(_approvedAmount > minApproveAmount);
        afterApproved?.(_approvedAmount > minApproveAmount);
      }, 100);
      return;
    }

    setTimeout(async () => {
      const tokenApproved = await tokenContract.isApprovedForAll(
        account,
        operatorAddress,
      );
      setIsApproved(tokenApproved);
      afterApproved?.(tokenApproved);
    }, 100);
  };

  const handleApprove = async () => {
    if (!tokenContract || !web3Provider) {
      return;
    }
    setApproving(true);
    try {
      if (tokenType === 'ERC20') {
        const tx = await tokenContract.approve(operatorAddress, APPROVE_AMOUNT);
        const receipt = await tx.wait();

        if (receipt) {
          setApproving(false);
          getApprovement();
        }
      }
      const approvalTx = await tokenContract.setApprovalForAll(operatorAddress, true);

      const receipt = await approvalTx.wait();

      if (receipt) {
        setApproving(false);
        getApprovement();
      }
    } catch (error) {
      console.warn(error);
      setApproving(false);
    }
  };

  if (isApproved && approvedComponent) {
    return approvedComponent;
  }

  return (
    <>
      {!isApproved && (
        <ConfirmButton className={customClass} onClick={handleApprove}>
          {approving ? 'Approving' : 'Approve'}
        </ConfirmButton>
      )}
    </>
  );
};

export default ApprovalOperator;

const ConfirmButton = styled.div`
  width: 128px;
  height: 32px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #32b475 0%, #117b48 100%);
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: #ffffff;
  border: none;
  opacity: 0.8;
  margin-right: 0;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &.disabled {
    background: #c9c9c9;
    color: #8a8a8a;
    opacity: 0.7 !important;
    cursor: not-allowed;
  }
`;
