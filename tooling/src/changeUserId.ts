import { admin } from "./firestore";

export const changeUserId = async () => {
  // const oldUser = await admin
  //   .auth()
  //   .getUserByEmail("thanveerahamed.developer@gmail.com");
  // console.log("Old user found:", oldUser);

  // let dataToTransfer_keys = ["disabled", "displayName", "email", "emailVerified", "phoneNumber", "photoURL", "uid"];
  // let newUserData: Record<string, any> = {};
  // for (let key of dataToTransfer_keys) {
  //     // @ts-ignore
  //     newUserData[key] = oldUser[key];
  // }
  //
  // Object.assign(newUserData, newUser);
  // console.log("New user data ready: ", newUserData);

  const newUser = await admin.auth().createUser({
    uid: "RNJMbDNuXrOYGY8a3BC8NgmFNQj1",
    email: "thanveerahamed.developer@gmail.com",
    emailVerified: false,
    displayName: "test",
    phoneNumber: "+31987654321",
    disabled: false,
  });
  console.log("New user created: ", newUser);
};
