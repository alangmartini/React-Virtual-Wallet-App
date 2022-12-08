import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { currentAction } from '../redux/actions';

class WalletForm extends Component {
  state = {
    fetched: false,
  };

  componentDidMount() {
    this.fetchOptions();
  }

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

  render() {
    const { fetched } = this.state;
    const { coins } = this.props;
    return (
      <div>
        WalletForm
        <input
          data-testid="value-input"
          type="text"
          // onChange={ handleChange }
        />
        <input
          data-testid="description-input"
          type="text"
          // onChange={ handleChange }
        />
        <select data-testid="currency-input">
          { fetched && coins
            .map((key) => <option key={ key } value={ key }>{ key }</option>)}
        </select>
        <select
          data-testid="method-input"
        >
          { ['Dinheiro', 'Cartão de crédito', 'Cartão de débito']
            .map((forma) => <option key={ forma } value={ forma }>{ forma }</option>)}
        </select>
        <select
          data-testid="tag-input"
        >
          { ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde']
            .map((tag) => <option key={ tag } value={ tag }>{ tag }</option>)}
        </select>
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
