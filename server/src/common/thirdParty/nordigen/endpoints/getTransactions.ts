import axios, { AxiosRequestConfig } from 'axios';
import { TransactionsInformation } from '../types';
import { getAccessToken } from './getAccessToken';
import { NORDIGEN_V2_API } from '../constants';

export const getTransactions = async (
  accountId: string,
): Promise<TransactionsInformation> => {
  const { access } = await getAccessToken();

  const headers = { authorization: `Bearer ${access}` };
  const config: AxiosRequestConfig = {
    headers,
  };
  const response = await axios.get(
    `${NORDIGEN_V2_API}/accounts/${accountId}/transactions`,
    config,
  );

  return response.data as TransactionsInformation;
};
