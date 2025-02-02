import axios from 'axios';
import { NORDIGEN_TEXT, NORDIGEN_V2_API } from '../constants';
import { AccessTokenDetails, BankingApi } from '../types';
import { firestore } from '../../../firebase';
import { CollectionNames } from '@expense-manager/schema';

export const getAccessToken = async (): Promise<AccessTokenDetails> => {
  const snapshot = await firestore
    .collection(CollectionNames.BankingApis)
    .doc(NORDIGEN_TEXT)
    .get();

  const document = snapshot.data() as BankingApi;

  const body = {
    secret_id: document.userSecret.id,
    secret_key: document.userSecret.secret,
  };

  const response = await axios.post(`${NORDIGEN_V2_API}/token/new/`, body);

  const accessToken = response.data;

  return {
    access: accessToken.access,
    refresh: accessToken.refresh,
    refreshExpires: accessToken.refresh_expires,
    accessExpires: accessToken.access_expires,
  };
};
