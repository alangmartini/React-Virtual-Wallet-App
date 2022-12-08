import { CURRENCY, COTATION, REGISTER_EXPENSE } from '../actions';

// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas
const INITIAL_STATE = {
  despesaTotal: '0',
  expenses: [], // array de objetos, com cada objeto tendo as chaves id, value, currency, method, tag, description e exchangeRates
  editor: false, // valor booleano que indica de uma despesa está sendo editada
  idToEdit: 0, // valor numérico que armazena o id da despesa que esta sendo editada
  currencies: [''], // array de string
};

const walletReducer = (state = INITIAL_STATE, action) => {
  const { payload, type } = action;
  switch (type) {
  case CURRENCY:
    return {
      ...state,
      currencies: payload,
    };
  case REGISTER_EXPENSE:
    return {
      ...state,
      expenses: [...state.expenses, { ...payload, id: state.expenses.length }], // you dont need a  -1, cuz it gets the previous state expense length
    };
  case COTATION:
    return {
      ...state,
      despesaTotal: payload,
    };

  default:
    return { ...state };
  }
};

export default walletReducer;
