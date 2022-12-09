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
export const DELETE = 'DELETE';

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

export const findCorrectRate = (expenseObject) => {
  const { exchangeRates, currency } = expenseObject;
  if (currency) {
    const isTest = !Object.keys(exchangeRates)[0].includes('BRL');
    const keyName = isTest ? currency : `${currency}BRL`;
    const expenseCoin = Object.keys(exchangeRates)
      .find((rateName) => rateName === keyName);
    return exchangeRates[expenseCoin];
  }
};

export const calculateExpenseSum = (expensesArr) => {
  const sum = expensesArr.reduce((acc, expense) => {
    const correctRate = findCorrectRate(expense);
    if (correctRate) {
      const convertedValue = expense.value * parseFloat(correctRate.ask);
      return (parseFloat(acc) + convertedValue).toFixed(2);
    }
    return acc;
  }, 0);
  return sum;
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
      dispatch(registerExpense({ ...input, exchangeRates: cotation }));
      const sum = calculateExpenseSum(getState().wallet.expenses);
      dispatch(updateTotalAmountAction(sum));
    });
};

export const deleteExpenseAction = (payload) => ({
  type: DELETE,
  payload,
});

export const exporter = {
  userAction,
  currentAction,
  updateTotalAmountAction,
  registerExpense,
  fetchCoinThunk,
};
