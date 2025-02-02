import axios, { AxiosRequestConfig } from 'axios';
import { Collections } from '@expense-manager/schema';
import { getAccessToken } from './getAccessToken';
import {
  DEFAULT_ACCESS_SCOPE,
  DEFAULT_ACCESS_VALID_DAYS,
  DEFAULT_MAX_HISTORICAL_DAYS,
  NORDIGEN_V2_API,
  SANDBOX_INSTITUTION,
  SANDBOX_MAX_HISTORICAL_DAYS,
} from '../constants';

export const createEndUserAgreement = async ({
  institutionId,
  token,
}: {
  institutionId: string;
  token?: string;
}): Promise<Collections.BankingApi.CreateEndUserAgreementResponse> => {
  const access = token ?? (await getAccessToken()).access;

  const headers = { authorization: `Bearer ${access}` };
  const config: AxiosRequestConfig = {
    headers,
  };
  const payload: Collections.BankingApi.CreateEndUserAgreementRequest = {
    access_scope: DEFAULT_ACCESS_SCOPE,
    access_valid_for_days: DEFAULT_ACCESS_VALID_DAYS,
    institution_id: institutionId,
    max_historical_days:
      institutionId === SANDBOX_INSTITUTION
        ? SANDBOX_MAX_HISTORICAL_DAYS
        : DEFAULT_MAX_HISTORICAL_DAYS,
  };
  const response = await axios.post(
    `${NORDIGEN_V2_API}/agreements/enduser/`,
    payload,
    config,
  );

  return response.data as Collections.BankingApi.CreateEndUserAgreementResponse;
};
