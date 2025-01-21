import {collection, doc, getDoc, getDocs, setDoc} from "firebase/firestore";
import {MAIN_USER_ID, TEST_USER_ID} from "./constants";

export const getData = async (db: any) => {
    const snapshots = await doc(db, `dailyExpense/${MAIN_USER_ID}`);
    console.log(JSON.stringify((await getDoc(snapshots)).data()));
};

export const migrateDailyExpense = async (db: any) => {
    const snapshots = await doc(db, `dailyExpense/${MAIN_USER_ID}`);
    const dailyExpenseRef = doc(db, `dailyExpense/${TEST_USER_ID}`);

    const oldDailyExpense = (await getDoc(snapshots)).data();

    if (oldDailyExpense !== undefined) {
        console.log("Start - Migrate daily expense");
        await setDoc(dailyExpenseRef, oldDailyExpense);
        console.log("Created daily expense:", dailyExpenseRef.id);
        console.log("End - Migrate daily expense");
        console.log("============================================");

        console.log("Start - Migrate budget");
        const budgetCollectionRef = collection(
            db,
            "dailyExpense",
            MAIN_USER_ID,
            "budgets",
        );

        const budgetSnapshots = await getDocs(budgetCollectionRef);
        for (const document of budgetSnapshots.docs) {
            const budget = document.data();

            if (budget !== undefined) {
                const budgetDocumentRef = doc(
                    db,
                    "dailyExpense",
                    TEST_USER_ID,
                    "budgets",
                    document.id,
                );
                await setDoc(budgetDocumentRef, budget);
                console.log("Created budget document:", budgetDocumentRef.id);
            }
        }
        console.log("End - Migrate budget");
        console.log("============================================");

        console.log("Start - Migrate labels");

        const labelsCollectionRef = collection(
            db,
            "dailyExpense",
            MAIN_USER_ID,
            "labels",
        );

        const labelsSnapshots = await getDocs(labelsCollectionRef);
        for (const document of labelsSnapshots.docs) {
            const labels = document.data();

            if (labels !== undefined) {
                const labelDocumentRef = doc(
                    db,
                    "dailyExpense",
                    TEST_USER_ID,
                    "labels",
                    document.id,
                );
                await setDoc(labelDocumentRef, labels);
                console.log("Created label document:", labelDocumentRef.id);
            }
        }
        console.log("End - Migrate labels");
        console.log("============================================");

        console.log("Start - Migrate months");

        const monthsCollectionRef = collection(
            db,
            "dailyExpense",
            MAIN_USER_ID,
            "months",
        );

        const monthsSnapshots = await getDocs(monthsCollectionRef);
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

        console.log("Start - Migrate transactions");

        const transactionsCollectionRef = collection(
            db,
            "dailyExpense",
            MAIN_USER_ID,
            "transactions",
        );

        const transactionsSnapshots = await getDocs(transactionsCollectionRef);
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
                console.log("Created transaction document:", transactionDocumentRef.id);
            }
        }
        console.log("End - Migrate transactions");
        console.log("============================================");

        // console.log("Start - Migrate nordigen requisition");
        //
        // const nordigenDocumentRef = doc(
        //     db,
        //     "users",
        //     MAIN_USER_ID,
        //     "bankingApis",
        //     "nordigen"
        // );
        //
        // const nordigenSnapshot = await getDoc(nordigenDocumentRef);
        // const oldNordigenRequisition = nordigenSnapshot.data();
        //
        // if(oldNordigenRequisition != undefined) {
        //   const newNordigenRequisitionRef = doc(
        //       db,
        //       "users",
        //       TEST_USER_ID,
        //       "bankingApis",
        //       nordigenSnapshot.id,
        //   );
        //   await setDoc(newNordigenRequisitionRef, oldNordigenRequisition);
        // }
        // console.log("Created nordigen document");
        // console.log("End - Migrate nordigen requisition");
        console.log("============================================");
    }
};
