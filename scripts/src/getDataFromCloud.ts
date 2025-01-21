import {MAIN_USER_ID, TEST_USER_ID} from "./constants";
import {firestore} from "./firestore";
import {db} from "./emulator";
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {FieldPath} from "@google-cloud/firestore";

export const getDataFromCloud = async () => {
    const budgetCollectionRef = firestore.collection(
        `dailyExpense/${MAIN_USER_ID}/budgets`,
    );
    const budgetSnapshots = await budgetCollectionRef.get();
    const budgets = budgetSnapshots.docs.map((document) => ({
        id: document.id,
        data: document.data(),
    }));

    for (const budget of budgets) {
        console.log("writing budget:", budget.id, "user", TEST_USER_ID);
        const budgetDocumentRef = doc(
            db,
            "dailyExpense",
            TEST_USER_ID,
            "budgets",
            budget.id,
        );
        await setDoc(budgetDocumentRef, {
            ...budget.data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    }

    console.log("End - Migrate budget");
    console.log("============================================");

    const labelsCollectionSnapshots = await firestore
        .collection(`dailyExpense/${MAIN_USER_ID}/labels`)
        .get();

    for (const document of labelsCollectionSnapshots.docs) {
        const labels = document.data();

        if (labels !== undefined) {
            const labelDocumentRef = doc(
                db,
                "dailyExpense",
                TEST_USER_ID,
                "labels",
                document.id,
            );
            await setDoc(labelDocumentRef, {
                ...labels,
                createdAt: serverTimestamp(),
            });
            console.log("Created label document:", labelDocumentRef.id);
        }
    }

    console.log("End - Migrate labels");
    console.log("============================================");

    const monthsSnapshots = await firestore
        .collection(`dailyExpense/${MAIN_USER_ID}/months`)
        .get();
    for (const document of monthsSnapshots.docs) {
        const month = document.data();

        if (month !== undefined) {
            const monthsDocumentRef = doc(
                db,
                "dailyExpense",
                TEST_USER_ID,
                "months",
                document.id,
            );
            await setDoc(monthsDocumentRef, month);
            console.log("Created month document:", monthsDocumentRef.id);
        }
    }
    console.log("End - Migrate months");
    console.log("============================================");

    const transactionsSnapshots = await firestore
        .collection(`dailyExpense/${MAIN_USER_ID}/transactions`)
        .orderBy(new FieldPath("bookingDate"), "desc")
        .where(new FieldPath("bookingDate"), ">=", "2024-07-15")
        .limit(2000)
        .get();
    for (const document of transactionsSnapshots.docs) {
        const transaction = document.data();

        if (transaction !== undefined) {
            const transactionDocumentRef = doc(
                db,
                "dailyExpense",
                TEST_USER_ID,
                "transactions",
                document.id,
            );
            await setDoc(transactionDocumentRef, transaction);
            console.log(
                "Created transaction document:",
                transactionDocumentRef.id,
                JSON.stringify(transaction.bookingDate),
            );
        }
    }
    console.log("End - Migrate transactions");
    console.log("============================================");
};
