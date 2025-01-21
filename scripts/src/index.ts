import * as dotenv from "dotenv";
import {migrateDailyExpense} from "./local";
import {initializeApp} from "firebase/app";
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";
import {getDataFromCloud} from "./getDataFromCloud";
import {runDayJs} from "./dayjsExample";
import {insertRequisition} from "./insertRequisition";
import {changeUserId} from "./changeUserId";
import {getTrainingData} from "./generateDataForMLTraining";

dotenv.config();
const runLocal = async () => {
    initializeApp({projectId: process.env.PROJECT_ID});
    const db = getFirestore();
    connectFirestoreEmulator(db, "127.0.0.1", 8080);

    await migrateDailyExpense(db);
};

const runCloud = async () => {
    initializeApp({projectId: process.env.PROJECT_ID});
    const db = getFirestore();
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    await getDataFromCloud();
};

const main = async () => {
    try {
        if (process.env.RUN_ENVIRONMENT === "cloud") {
            console.log("starting cloud");
            await runCloud();
        } else if (process.env.RUN_ENVIRONMENT === "local") {
            await runLocal();
        } else if (process.env.RUN_ENVIRONMENT === "dayjs") {
            runDayJs();
        } else if (process.env.RUN_ENVIRONMENT === "updateRequisition") {
            await insertRequisition();
        } else if (process.env.RUN_ENVIRONMENT === "updateUser") {
            await changeUserId();
        } else if (process.env.RUN_ENVIRONMENT === "getTrainingData") {
            await getTrainingData();
        }
    } catch (error: any) {
        console.error(error);
    }
};

(async () => {
    await main();
})();
