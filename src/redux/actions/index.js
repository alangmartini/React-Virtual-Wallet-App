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
export const EDIT = 'EDIT';
export const RESOLVE_EDIT = 'RESOLVE_EDIT';

export const currentAction = (payload) => ({
  type: CURRENCY,
  payload,
});

export const updateTotalAmountAction = (sum) => ({
  type: COTATION,
  payload: sum,
});

export const registerExpense = (expenseObj, id) => ({
  type: REGISTER_EXPENSE,
  payload: expenseObj,
  id,
});

export const reduceCoinAndPrices = (arrOfExpenses) => {
  const object = arrOfExpenses.reduce((acc, { currency, value }) => {
    const numValue = Number(value);
    acc[currency] = acc[currency] ? acc[currency] + numValue : numValue;
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
    const convertedValue = expense.value * parseFloat(correctRate.ask);
    return (parseFloat(acc) + convertedValue).toFixed(2);
  }, 0);
  return sum;
};

export const fetchCoinThunk = (input, editId) => (dispatch, getState) => {
  const { wallet: { expenses } } = getState();

  const allExpenses = reduceCoinAndPrices([...expenses, input]);

  const allCoins = new Set(Object.keys(allExpenses));
  const endpoint = Array.from(allCoins)
    .reduce((acc, coin, index) => (!index ? `${coin}-BRL` : `${acc},${coin}-BRL`), '');

  return fetch(`https://economia.awesomeapi.com.br/last/${endpoint}`)
    .then((response) => response.json())
    .then((cotation) => {
      dispatch(registerExpense({ ...input, exchangeRates: cotation }, editId));
      const sum = calculateExpenseSum(getState().wallet.expenses);
      dispatch(updateTotalAmountAction(sum));
    });
};

export const deleteExpenseAction = (payload) => ({
  type: DELETE,
  payload,
});

export const editExpenseAction = (payload) => ({
  type: EDIT,
  payload,
});

export const resolveEdit = (payload) => ({
  type: RESOLVE_EDIT,
  payload,
});
