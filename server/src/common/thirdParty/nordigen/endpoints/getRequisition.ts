import axios, { AxiosRequestConfig } from 'axios';
import { Collections } from '@expense-manager/schema';
import { getAccessToken } from './getAccessToken';
import { NORDIGEN_V2_API } from '../constants';

export const getRequisition = async (
  requisitionId: string,
): Promise<Collections.BankingApi.CreateRequisitionResponse> => {
  const { access } = await getAccessToken();

  const headers = { authorization: `Bearer ${access}` };
  const config: AxiosRequestConfig = {
    headers,
  };
  const response = await axios.get(
    `${NORDIGEN_V2_API}/requisitions/${requisitionId}`,
    config,
  );

  return response.data as Collections.BankingApi.CreateRequisitionResponse;
};
