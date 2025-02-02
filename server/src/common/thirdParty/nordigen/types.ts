export interface AccessTokenDetails {
  access: string;
  accessExpires: number;
  refresh: string;
  refreshExpires: number;
}

export interface UserSecret {
  id: string;
  secret: string;
}

export interface BankingApi {
  userSecret: UserSecret;
}

export interface Amount {
  amount: string;
  currency: string;
}

export interface Account {
  iban: string;
}

export enum TransactionStatus {
  Booked = 'booked',
  Pending = 'pending',
}

export interface Transaction {
  transactionId: string;
  endToEndId: string;
  valueDate: string;
  bookingDate: string;
  transactionAmount: Amount;
  creditorName: string;
  creditorAccount: Account;
  debtorName: string;
  debtorAccount: Account;
  remittanceInformationUnstructured: string;
  proprietaryBankTransactionCode: string;
  internalTransactionId: string;
  transactionStatus?: TransactionStatus;
}

export interface TransactionsInformation {
  transactions: {
    booked: Transaction[];
    pending: Transaction[];
  };
}
