import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { currentAction, fetchCoinThunk } from '../redux/actions';

const INITIAL_STATE = {
  fetched: false,
  input: {
    value: '',
    description: '',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Folia',
  },
};

class WalletForm extends Component {
  state = INITIAL_STATE;

  componentDidMount() {
    this.fetchOptions();
  }

  handleChange = (event) => { // repeated function, find a way to avoid
    const { value, name } = event.target;
    this.setState((prevState) => ({
      input: {
        ...prevState.input,
        [name]: value,
      },
    }));
    return value;
  };

  fetchOptions = async () => {
    const { dispatch } = this.props;
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const json = await response.json();
    const removeUSDT = (arr) => arr.filter((coin) => coin !== 'USDT');
    dispatch(currentAction(removeUSDT(Object.keys(json))));
    this.setState({
      fetched: true,
    });
  };

  handleSubmit = () => {
    this.setState({ input: INITIAL_STATE.input });
    const { dispatch } = this.props;
    const { input } = this.state;
    dispatch(fetchCoinThunk(input));
  };

  render() {
    const { fetched, input: { value,
      description,
      currency,
      method,
      tag },
    } = this.state;
    const { coins } = this.props;
    return (
      <div>
        WalletForm
        <input
          onChange={ this.handleChange }
          value={ value }
          name="value"
          data-testid="value-input"
          type="text"
        />
        <input
          onChange={ this.handleChange }
          value={ description }
          name="description"
          data-testid="description-input"
          type="text"
        />
        <select
          onChange={ this.handleChange }
          value={ currency }
          name="currency"
          data-testid="currency-input"
        >
          { fetched && coins
            .map((key) => <option key={ key } value={ key }>{ key }</option>)}
        </select>
        <select
          onChange={ this.handleChange }
          value={ method }
          name="method"
          data-testid="method-input"
        >
          { ['Dinheiro', 'Cartão de crédito', 'Cartão de débito']
            .map((forma) => <option key={ forma } value={ forma }>{ forma }</option>)}
        </select>
        <select
          onChange={ this.handleChange }
          value={ tag }
          name="tag"
          data-testid="tag-input"
        >
          { ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde']
            .map((obj) => <option key={ obj } value={ obj }>{ obj }</option>)}
        </select>
        <button
          type="button"
          onClick={ this.handleSubmit }
        >
          Adicionar despesa
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  coins: state.wallet.currencies,
});

WalletForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  coins: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default connect(mapStateToProps)(WalletForm);
