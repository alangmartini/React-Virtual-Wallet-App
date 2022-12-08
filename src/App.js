import React from 'react';
import { Route } from 'react-router-dom';
import Login from './pages/Login';
import Wallet from './pages/Wallet';
import store from './redux/store';

function App() {
  console.log(store.getState());
  return (
    <div>
      <h1>Hello, TrybeWallet!</h1>
      <Route exact path="/" render={ (props) => <Login { ...props } /> } />
      <Route path="/carteira" render={ () => <Wallet /> } />
    </div>
  );
}

export default App;
