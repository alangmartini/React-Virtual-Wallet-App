import React from 'react';
import WalletForm from '../components/WalletForm';
import store from '../redux/store';

class Wallet extends React.Component {
  render() {
    const { user } = store.getState();

    return (
      <div>
        <header>
          <h1>TrybeWallet</h1>
          <p data-testid="email-field">{ user.email }</p>
          <div>
            <p>Despesa Total:</p>
            <p data-testid="total-field">0</p>
            <p data-testid="header-currency-field">BRL</p>
          </div>
        </header>
        <WalletForm />
      </div>
    );
  }
}

export default Wallet;
