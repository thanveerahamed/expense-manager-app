export interface TransactionAmount {
  amount: string;
  currency: string;
}

export interface CreditorAccount {
  iban: string;
}

export interface DebtorAccount {
  iban: string;
}

export interface NordigenTransaction {
  transactionId: string;
  endToEndId: string;
  bookingDate: string;
  transactionAmount: TransactionAmount;
  creditorName: string;
  remittanceInformationUnstructured: string;
  proprietaryBankTransactionCode: string;
  internalTransactionId: string;
  creditorAccount: CreditorAccount;
  debtorName: string;
  debtorAccount: DebtorAccount;
}
