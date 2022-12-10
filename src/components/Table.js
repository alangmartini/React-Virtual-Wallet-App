import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { findCorrectRate, deleteExpenseAction,
  calculateExpenseSum, updateTotalAmountAction,
  editExpenseAction } from '../redux/actions';

class Table extends Component {
  parseInfomation = (expenses) => {
    const withConversionCoin = expenses.map((info) => {
      const expenseRate = findCorrectRate(info);
      return { ...info, conversion: expenseRate.name };
    });
    return withConversionCoin;
  };

  handleDelete = (id) => {
    const { dispatch, expenses } = this.props;
    dispatch(deleteExpenseAction(id));
    const sum = calculateExpenseSum(expenses.filter((expense) => expense.id !== id));
    dispatch(updateTotalAmountAction(sum));
  };

  handleEdit = (id) => {
    const { dispatch } = this.props;
    dispatch(editExpenseAction(id));
  };

  render() {
    const { expenses } = this.props;
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
                tag, value, method, conversion, id } = expense;
              const currentRate = findCorrectRate(expense);
              const rate = currentRate.ask;
              const convertedValue = (parseFloat(rate) * parseFloat(value))
                .toFixed(2);
              return (
                <tr key={ value }>
                  <td data-testid="teste">{ description }</td>
                  <td>{ tag }</td>
                  <td>{ method }</td>
                  <td>{ parseFloat(value).toFixed(2) }</td>
                  <td>{ conversion }</td>
                  <td>{ parseFloat(currentRate.ask).toFixed(2) }</td>
                  <td>{ convertedValue }</td>
                  <td>Real</td>
                  <td>
                    <button
                      type="button"
                      data-testid="delete-btn"
                      onClick={ () => this.handleDelete(id) }
                    >
                      Deletar
                    </button>
                    <button
                      type="button"
                      data-testid="edit-btn"
                      onClick={ () => this.handleEdit(id) }
                    >
                      Editar
                    </button>

                  </td>
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
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(Table);
