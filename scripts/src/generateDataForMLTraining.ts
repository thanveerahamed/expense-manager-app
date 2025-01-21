import {firestore} from "./firestore";
import {MAIN_USER_ID} from "./constants";
import {FieldPath} from "@google-cloud/firestore";
import {json2csv} from 'json-2-csv'
import * as fs from "node:fs";


export const getVendorName = (transaction: any) => {
    return transaction.creditorName === undefined
        ? transaction.debtorName === undefined
            ? transaction.proprietaryBankTransactionCode
            : transaction.debtorName
        : transaction.creditorName;
};

export const getTrainingData = async () => {
    const budgetCollectionRef = firestore.collection(
        `dailyExpense/${MAIN_USER_ID}/budgets`,
    );
    const budgetSnapshots = await budgetCollectionRef.get();
    const budgets = budgetSnapshots.docs.map((document) => ({
        id: document.id,
        data: document.data(),
    }));

    const transactionsSnapshots = await firestore
        .collection(`dailyExpense/${MAIN_USER_ID}/transactions`)
        .orderBy(new FieldPath("bookingDate"), "desc")
        .get();

    const collection = []

    for (const document of transactionsSnapshots.docs) {
        const transaction = document.data();

        if (transaction !== undefined) {
            collection.push({
                name: getVendorName(transaction),
                amount: transaction.transactionAmount.amount,
                category: `${transaction.category.parent}_${transaction.category.name}`
            })
        }
    }

    const csv = json2csv(collection);

    fs.writeFile(__dirname + '/../training.csv', csv, err => {
        if (err) {
            console.error(err);
        } else {
            console.log('success', __dirname + '/../output/training.csv')
        }
    });
}