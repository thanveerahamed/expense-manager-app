import {isEmailValid, isFieldEmpty} from '../../common/validators';

export const isLoginFormValid = (email: string, password: string) => {
    return isEmailValid(email) && !isFieldEmpty(password);
};
