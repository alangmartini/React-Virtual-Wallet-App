import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import mockData from './helpers/mockData';
import App from '../App';
import { userAction,
  currentAction,
  updateTotalAmountAction,
  registerExpense, fetchCoinThunk,
  reduceCoinAndPrices } from '../redux/actions';

const TEST_EMAIL = 'algo@alguem.com';
const TEST_PASSWORD = '123456';

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
  test('If Wallet Forms has all components', () => {
    const INITIAL_STATE = {
      despesaTotal: '0',
      expenses: [firstExpense],
      editor: false,
      idToEdit: 0,
      currencies: Object.keys(mockData),
    };
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'], initialState: INITIAL_STATE });

    const reduceCoinAndPricesMock = jest.fn(() => ({ USD: 11 }));
    fetchCoinThunk();
    expect(reduceCoinAndPricesMock).toHaveBeenCalled();

    const valueDisplay = screen.getByTestId('value-input');
    const descriptionDisplay = screen.getByTestId('description-input');
    const currencyDisplay = screen.getByTestId('currency-input');
    const methodDisplay = screen.getByTestId('method-input');
    const tagDisplay = screen.getByTestId('tag-input');

    expect(valueDisplay).toBeInTheDocument();
    expect(descriptionDisplay).toBeInTheDocument();
    expect(currencyDisplay).toBeInTheDocument();
    expect(methodDisplay).toBeInTheDocument();
    expect(tagDisplay).toBeInTheDocument();
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

    expect(reduceCoinAndPrices([firstExpense, secondExpense])).toEqual({
      USD: 11,
      EUR: 20,
    });

    expect(userAction(123)).toEqual(userExpectAwnser);
    expect(currentAction(123)).toEqual(currentExpectAwnser);
    expect(updateTotalAmountAction(123)).toEqual(updateExpectAwnser);
    expect(registerExpense(123)).toEqual(registerExpectAwnser);
  });
});
