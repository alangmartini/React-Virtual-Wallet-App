import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Table extends Component {
  findCorrectRate = (expenseObject) => {
    const { exchangeRates } = expenseObject;
    const isTest = !Object.keys(exchangeRates)[0].includes('BRL');
    const keyName = isTest ? expenseObject.currency : `${expenseObject.currency}BRL`;
    const expenseCoin = Object.keys(exchangeRates)
      .find((rateName) => rateName === keyName);
    return exchangeRates[expenseCoin];
  };

  parseInfomation = (expenses) => {
    const withConversionCoin = expenses.map((info) => {
      const expenseRate = this.findCorrectRate(info);
      return { ...info, conversion: expenseRate.name };
    });
    return withConversionCoin;
  };

  render() {
    const { expenses } = this.props;
    console.log(expenses);
    return (
      <div>
        <h1>Table</h1>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>

          </thead>
          <tbody>
            { expenses.length > 0 && this.parseInfomation(expenses).map((expense) => {
              const { description,
                tag, value, method, conversion } = expense;
              const currentRate = this.findCorrectRate(expense);
              const rate = currentRate.ask;
              const convertedValue = (parseFloat(rate) * parseFloat(value))
                .toFixed(2);
              return (
                <tr key={ value }>
                  <td>{ description }</td>
                  <td>{ tag }</td>
                  <td>{ method }</td>
                  <td>{ parseFloat(value).toFixed(2) }</td>
                  <td>{ conversion }</td>
                  <td>{ parseFloat(currentRate.ask).toFixed(2) }</td>
                  <td>{ convertedValue }</td>
                  <td>Real</td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
});

Table.propTypes = {
  expenses: PropTypes.arrayOf('').isRequired,
};

export default connect(mapStateToProps)(Table);
