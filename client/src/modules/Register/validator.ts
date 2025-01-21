import {isEmailValid, isFieldEmpty} from '../../common/validators';

export const isSignUpFormValid = (
    name: string,
    email: string,
    password: string,
) => {
    return isEmailValid(email) && !isFieldEmpty(password) && !isFieldEmpty(name);
};
