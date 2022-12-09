import React, { Component } from 'react';

class Table extends Component {
  render() {
    return (
      <div>
        <h1>Table</h1>
        <table>
          <th>Descrição</th>
          <th>Tag</th>
          <th>Método de pagamento</th>
          <th>Valor</th>
          <th>Moeda</th>
          <th>Câmbio utilizado</th>
          <th>Valor convertido</th>
          <th>Moeda gitde conversão</th>
          <th>Editar/Excluir</th>
        </table>
      </div>
    );
  }
}

export default Table;
