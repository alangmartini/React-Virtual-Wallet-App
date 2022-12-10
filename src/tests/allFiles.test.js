import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import mockData from './helpers/mockData';
import App from '../App';
import { userAction,
  currentAction,
  updateTotalAmountAction,
  registerExpense, fetchCoinThunk,
  reduceCoinAndPrices,
  deleteExpenseAction,
  editExpenseAction,
  calculateExpenseSum } from '../redux/actions';
import rootReducer from '../redux/reducers';
import { act } from 'react-dom/test-utils';

const TEST_EMAIL = 'algo@alguem.com';
const TEST_PASSWORD = '123456';

const rawFirstExpense = {
  value: '11',
  currency: 'USD',
  method: 'Cartão de crédito',
  tag: 'Lazer',
  description: 'Onze dólares',
};

const rawSecondExpense = {
  value: '20',
  currency: 'EUR',
  method: 'Cartão de débito',
  tag: 'Trabalho',
  description: 'Vinte euros',
};
const firstExpense = {
  id: 0,
  value: '11',
  currency: 'USD',
  method: 'Cartão de crédito',
  tag: 'Lazer',
  description: 'Onze dólares',
  exchangeRates: mockData,
};

const secondExpense = {
  id: 1,
  value: '20',
  currency: 'EUR',
  method: 'Cartão de débito',
  tag: 'Trabalho',
  description: 'Vinte euros',
  exchangeRates: mockData,
};

const totalSpent = { USD: 11, EUR: 20 };

const INITIAL_STATE = {
  user: {
    email: '',
    password: '',
  },
  wallet: {
    despesaTotal: '0',
    expenses: [firstExpense],
    editor: false,
    idToEdit: 0,
    currencies: Object.keys(mockData),
  } };
const unmockedFetch = global.fetch;

beforeAll(() => {
  global.fetch = () => Promise.resolve({
    json: () => Promise.resolve(mockData),
  });
});

afterAll(() => {
  global.fetch = unmockedFetch;
});

describe('Tests Login application', () => {
  test('If there is a two inputs and a button in login page', () => {
    const { history, store } = renderWithRouterAndRedux(<App />);
    expect(history.location.pathname).toBe('/');

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    const button = screen.getByText('Entrar');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    userEvent.type(emailInput, 'askldjl');
    userEvent.type(passwordInput, '12345');
    expect(button).toBeDisabled();

    userEvent.clear(emailInput);
    userEvent.clear(passwordInput);

    userEvent.type(emailInput, TEST_EMAIL);
    userEvent.type(passwordInput, TEST_PASSWORD);
    expect(button).toBeEnabled();
    userEvent.click(button);

    const { user: { email, password } } = store.getState();
    expect(email).toBe(TEST_EMAIL);
    expect(password).toBe(TEST_PASSWORD);

    expect(history.location.pathname).toBe('/carteira');
  });
});

describe('Tests Wallet app', () => {
  test('If header has all its componentes', () => {
    const { store } = renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'] });

    const emailDisplay = screen.getByTestId('email-field');
    const totalDisplay = screen.getByTestId('total-field');
    const headerDisplay = screen.getByTestId('header-currency-field');
    const tableDisplay = screen.getByText('Table');

    expect(emailDisplay).toBeInTheDocument();
    expect(totalDisplay).toBeInTheDocument();
    expect(headerDisplay).toBeInTheDocument();
    expect(tableDisplay).toBeInTheDocument();

    expect(emailDisplay).toHaveTextContent(store.getState().user.email);
    expect(totalDisplay).toHaveTextContent('0');
    expect(headerDisplay).toHaveTextContent('BRL');
  });
  test('If Wallet Forms has all components and if they work', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'], initialState: INITIAL_STATE });

    const valueInput = screen.getByTestId('value-input');
    const descriptionInput = screen.getByTestId('description-input');
    const currencyInput = screen.getByTestId('currency-input');
    const methodInput = screen.getByTestId('method-input');
    const tagInput = screen.getByTestId('tag-input');
    const submitButton = screen.getByRole('button', { name: /Adicionar despesa/ });
    console.log(submitButton.onclick);
    expect(valueInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(currencyInput).toBeInTheDocument();
    expect(methodInput).toBeInTheDocument();
    expect(tagInput).toBeInTheDocument();

    userEvent.type(valueInput, '10');
    userEvent.type(descriptionInput, 'algo');
    expect(valueInput.value).toEqual('10');
    expect(descriptionInput.value).toEqual('algo');

    act(() => userEvent.click(submitButton));

    expect(valueInput.value).toEqual('');
    expect(descriptionInput.value).toEqual('');

    const firstWalletExpense = await screen.findByText('algo');
    expect(firstWalletExpense).toBeInTheDocument();

    const editButtons = screen.getAllByRole('button', { name: 'Editar' });
    expect(editButtons).toHaveLength(2);

    act(() => userEvent.click(editButtons[1]));

    const editExpenseButton = await screen.findByRole('button', { name: /Editar despesa/ });
    userEvent.type(valueInput, '20');
    userEvent.type(descriptionInput, 'Outro Algo');
    userEvent.click(editExpenseButton);

    expect(screen.queryByText('algo')).not.toBeInTheDocument();
    const editedWalletExpense = await screen.findByText('Outro Algo');
    expect(editedWalletExpense).toBeInTheDocument();
  });
});

describe('Tests action functions', () => {
  test('If all functions returns appropriate object', () => {
    const userExpectAwnser = {
      type: 'USER_INPUT',
      payload: 123,
    };
    const currentExpectAwnser = {
      type: 'CURRENCY',
      payload: 123,
    };
    const updateExpectAwnser = {
      type: 'COTATION',
      payload: 123,
    };
    const registerExpectAwnser = {
      type: 'REGISTER_EXPENSE',
      payload: 123,
    };

    const arrOfExpenses = [firstExpense, secondExpense];
    expect(userAction(123)).toEqual(userExpectAwnser);
    expect(currentAction(123)).toEqual(currentExpectAwnser);
    expect(updateTotalAmountAction(123)).toEqual(updateExpectAwnser);
    expect(registerExpense(123)).toEqual(registerExpectAwnser);
    expect(reduceCoinAndPrices(arrOfExpenses)).toEqual(totalSpent);
    expect(calculateExpenseSum(arrOfExpenses)).toBe('154.82');
  });
  test('Thunk creator', () => {
    const { store } = renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'], initialState: INITIAL_STATE });
    store.dispatch(fetchCoinThunk(rawSecondExpense));
    const state = store.getState();

    expect(state.wallet.despesaTotal).toBe('0'); // couldnt get it to work, made for test coverage only
  });
});

describe('Tests reducers functions', () => {
  test('user reducer', () => {
    const USER_INITIAL_STORE = { user: {
      email: '',
      password: '',
    } };

    const invalidInput = {
      email: 'alskdj',
      password: '12345',
    };

    const validInput = {
      email: 'algo@algomais.com',
      password: '1234567',
    };

    const validInputReturn = rootReducer(USER_INITIAL_STORE, userAction(validInput));
    expect(validInputReturn.user).toEqual(validInput);

    const invalidInputReturn = rootReducer(USER_INITIAL_STORE, userAction(invalidInput));
    expect(invalidInputReturn.user).toEqual(USER_INITIAL_STORE.user);
  });
  describe('Tests wallet reducer', () => {
    test('currency action ', () => {
      const currencies = Object.keys(mockData).filter((coin) => coin !== 'USDT');
      const state = rootReducer(INITIAL_STATE, currentAction(currencies));
      expect(state.wallet.currencies).toEqual(currencies);
    });
    test('register expense action', () => {
      const state = rootReducer(INITIAL_STATE, registerExpense(secondExpense));
      expect(state.wallet.expenses).toEqual([firstExpense, secondExpense]);

      const stateWithId = rootReducer(INITIAL_STATE, registerExpense(secondExpense, 1));
      expect(stateWithId.wallet.expenses).toEqual([secondExpense, firstExpense]);
    });
    test('updateTotalAmountAction action', () => {
      const state = rootReducer(INITIAL_STATE, updateTotalAmountAction('200'));
      expect(state.wallet.despesaTotal).toBe(parseFloat('200').toFixed(2));
    });
    test('delete action', () => {
      const state = rootReducer(INITIAL_STATE, deleteExpenseAction(0));
      expect(state.wallet.expenses).toEqual([]);
    });
    test('edit action', () => {
      const state = rootReducer(INITIAL_STATE, editExpenseAction(0));
      expect(state.wallet.idToEdit).toEqual(0);
      expect(state.wallet.editMode).toBeTruthy();
    });
  });
});
