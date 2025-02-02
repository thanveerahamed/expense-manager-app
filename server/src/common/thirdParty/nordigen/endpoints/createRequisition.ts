import axios, { AxiosRequestConfig } from 'axios';
import { Collections } from '@expense-manager/schema';
import { getAccessToken } from './getAccessToken';
import { v4 as uuidV4 } from 'uuid';
import { DEFAULT_USER_LANGUAGE, NORDIGEN_V2_API } from '../constants';

export const createRequisition = async ({
  agreementId,
  institutionId,
  redirectUrl,
  reference,
  token,
}: {
  institutionId: string;
  agreementId: string;
  redirectUrl: string;
  reference?: string;
  token?: string;
}): Promise<Collections.BankingApi.CreateRequisitionResponse> => {
  const access = token ?? (await getAccessToken()).access;

  const headers = { authorization: `Bearer ${access}` };
  const config: AxiosRequestConfig = {
    headers,
  };
  const payload: Collections.BankingApi.CreateRequisitionRequest = {
    institution_id: institutionId,
    agreement: agreementId,
    redirect: redirectUrl,
    reference: reference ?? uuidV4(),
    user_language: DEFAULT_USER_LANGUAGE,
  };
  const response = await axios.post(
    `${NORDIGEN_V2_API}/requisitions/`,
    payload,
    config,
  );

  return response.data as Collections.BankingApi.CreateRequisitionResponse;
};
