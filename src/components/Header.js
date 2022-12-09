import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import store from '../redux/store';

class Header extends Component {
  render() {
    const { user } = store.getState();
    const { despesaTotal } = this.props;

    return (
      <header>
        <h1>TrybeWallet</h1>
        <p data-testid="email-field">{ user.email }</p>
        <div>
          <p>Despesa Total:</p>
          <p data-testid="total-field">{ despesaTotal }</p>
          <p data-testid="header-currency-field">BRL</p>
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  despesaTotal: state.wallet.despesaTotal,
});

Header.propTypes = {
  despesaTotal: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Header);
