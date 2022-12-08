// user actions
export const USER_INPUT = 'USER_INPUT';

export const userAction = (objectWithUserAndInput) => ({
  type: USER_INPUT,
  payload: objectWithUserAndInput,
});
