import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WalletForm from '../components/WalletForm';
import store from '../redux/store';

class Wallet extends React.Component {
  render() {
    const { user } = store.getState();
    const { despesaTotal } = this.props;

    return (
      <div>
        <header>
          <h1>TrybeWallet</h1>
          <p data-testid="email-field">{ user.email }</p>
          <div>
            <p>Despesa Total:</p>
            <p data-testid="total-field">{ despesaTotal }</p>
            <p data-testid="header-currency-field">BRL</p>
          </div>
        </header>
        <WalletForm />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  despesaTotal: state.wallet.despesaTotal,
});

Wallet.propTypes = {
  despesaTotal: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Wallet);
