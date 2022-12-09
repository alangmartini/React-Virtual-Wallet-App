// user actions
export const USER_INPUT = 'USER_INPUT';

export const userAction = (objectWithUserAndInput) => ({
  type: USER_INPUT,
  payload: objectWithUserAndInput,
});

// wallet actions
export const CURRENCY = 'CURRENCY';
export const COTATION = 'COTATION';
export const REGISTER_EXPENSE = 'REGISTER_EXPENSE';

export const currentAction = (payload) => ({
  type: CURRENCY,
  payload,
});

export const updateTotalAmountAction = (cotation) => ({
  type: COTATION,
  payload: cotation,
});

export const registerExpense = (expenseObj) => ({
  type: REGISTER_EXPENSE,
  payload: expenseObj,
});

export const reduceCoinAndPrices = (arr) => {
  const object = arr.reduce((acc, { currency, value }) => {
    if (acc[currency]) {
      acc[currency] += Number(value);
    } else {
      acc[currency] = Number(value);
    }
    return acc;
  }, {});
  return object;
};

export const fetchCoinThunk = (input) => (dispatch, getState) => {
  const { wallet: { expenses } } = getState();

  const allExpenses = reduceCoinAndPrices([...expenses, input]);

  const allCoins = new Set(Object.keys(allExpenses));
  const endpoint = Array.from(allCoins)
    .reduce((acc, coin, index) => (!index ? `${coin}-BRL` : `${acc},${coin}-BRL`), '');

  return fetch(`https://economia.awesomeapi.com.br/last/${endpoint}`)
    .then((response) => response.json())
    .then((cotation) => {
      console.log(allExpenses);
      const sum = Object.keys(allExpenses).reduce((acc, coin) => {
        const cotationInfoKey = Object.keys(cotation).find((key) => key.includes(coin)); // had to tweek cuz tests dont have a BRL on the coin
        const { ask } = cotation[cotationInfoKey];
        const convertedValue = allExpenses[coin] * parseFloat(ask);
        return (parseFloat(acc) + convertedValue).toFixed(2);
      }, 0);
      dispatch(registerExpense({ ...input, exchangeRates: cotation }));
      dispatch(updateTotalAmountAction(sum));
    });
};

export const exporter = {
  userAction,
  currentAction,
  updateTotalAmountAction,
  registerExpense,
  fetchCoinThunk,
};
