import axios, { AxiosRequestConfig } from 'axios';
import { Services } from '@expense-manager/schema';
import { getAccessToken } from './getAccessToken';
import { NORDIGEN_V2_API } from '../constants';

export const getBalances = async (accountId: string) => {
  const { access } = await getAccessToken();

  const headers = { authorization: `Bearer ${access}` };
  const config: AxiosRequestConfig = {
    headers,
  };
  const response = await axios.get(
    `${NORDIGEN_V2_API}/accounts/${accountId}/balances`,
    config,
  );

  return response.data as Services.BankingApi.NordigenBalances;
};
