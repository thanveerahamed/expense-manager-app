import { firestore } from "./firestore";
import { MAIN_USER_ID } from "./constants";

const requisition = {
  id: "d86b9421-5c7c-48e0-9b1c-eddf97180274",
  created: "2024-08-20T18:43:33.752766Z",
  redirect: "http://localhost:3000",
  status: "LN",
  institution_id: "ING_INGBNL2A",
  agreement: "68a23fb0-1070-4075-9b7b-c7e8d167ed36",
  reference: "f97a9df9-2ef9-4ca0-9b7f-95da89829e6b",
  accounts: ["d324ea16-2142-4116-beaf-2d46c3c26dbe"],
  user_language: "EN",
  link: "https://ob.gocardless.com/ob-psd2/start/86efc070-4a5b-492a-b653-0fdd8722f2d8/ING_INGBNL2A",
  ssn: null,
  account_selection: false,
  redirect_immediate: false,
};

export const insertRequisition = async () => {
  const nordigenDoc = firestore.doc(
    `users/${MAIN_USER_ID}/bankingApis/nordigen`,
  );

  //@ts-expect-error: ignore the error
  const updatedValue = await nordigenDoc.update(
    {
      requisition: {
        ...requisition,
        expired: false,
        failed: false,
      },
    },
    { merge: true },
  );

  console.log("completed:", updatedValue);
};
