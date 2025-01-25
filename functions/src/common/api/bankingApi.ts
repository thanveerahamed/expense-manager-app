import {
  default as realFetch,
  Request as FetchRequest,
  RequestInit,
} from "node-fetch";
import { URL_V1 } from "./constants";
import { Collections, Services } from "@expense-manager/schema";
import { logInfo } from "../logger";

const bankingUrl = `${URL_V1}/banking`;

export const getBankingTransactions = async ({
  token,
  body,
}: {
  token: string;
  body: { accountId: string };
}): Promise<Collections.Transactions.BankingAPITransaction[]> => {
  const url = `${bankingUrl}/transactions`;
  const requestInit: RequestInit = {
    method: "post",
    body: JSON.stringify(body),
    headers: [
      ["authorization", token],
      ["Content-Type", "application/json"],
    ],
  };

  logInfo(`${url} called.`);

  const fetchRequest = new FetchRequest(url, requestInit);
  const apiResponse = await realFetch(fetchRequest);
  const response = await apiResponse.json();

  if (apiResponse.status !== 200) {
    throw new Error(response);
  }

  return response as Collections.Transactions.BankingAPITransaction[];
};

export const getBalances = async ({
  token,
  body,
}: {
  token: string;
  body: { accountId: string };
}): Promise<Services.BankingApi.NordigenBalances> => {
  const url = `${bankingUrl}/balances`;
  const requestInit: RequestInit = {
    method: "post",
    body: JSON.stringify(body),
    headers: [
      ["authorization", token],
      ["Content-Type", "application/json"],
    ],
  };

  logInfo(`${url} called.`);

  const fetchRequest = new FetchRequest(url, requestInit);
  const apiResponse = await realFetch(fetchRequest);
  const response = await apiResponse.json();

  if (apiResponse.status !== 200) {
    throw new Error(response);
  }

  return response as Services.BankingApi.NordigenBalances;
};
