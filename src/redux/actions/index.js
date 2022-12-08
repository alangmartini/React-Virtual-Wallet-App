// user actions
export const USER_INPUT = 'USER_INPUT';

export const userAction = (objectWithUserAndInput) => ({
  type: USER_INPUT,
  payload: objectWithUserAndInput,
});

// wallet actins
export const CURRENCY = 'CURRENCY';

export const currentAction = (payload) => ({
  type: CURRENCY,
  payload,
});
