import { USER_INPUT } from '../actions/index';

const INITIAL_STATE = {
  email: '',
  password: '',
};

export const validateEmail = (input) => !!(input.match(
  /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+/i,
));

const MINIMUM_SIZE_PASSWORD = 5;
export const validatePassword = (input) => input.length > MINIMUM_SIZE_PASSWORD;

const userReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
  case USER_INPUT:
    if (validateEmail(payload.email) && validatePassword(payload.password)) {
      return { ...state,
        email: payload.email,
        password: payload.password,
      };
    }
    return { ...state };
  default:
    return state;
  }
};

export default userReducer;
