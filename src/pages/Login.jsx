import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { userAction } from '../redux/actions';
import { validateEmail, validatePassword } from '../redux/reducers/user'; // find a way to not use this twice per change

class Login extends Component {
  state = {
    email: '',
    password: '',
    isButtonValid: false,
  };

  handleSubmit = () => {
    const { email, password } = this.state;
    const { dispatch, history } = this.props;
    dispatch(userAction({ email, password }));
    history.push('/carteira');
  };

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    }, () => {
      const { email, password } = this.state;
      this.setState({ isButtonValid: (validateEmail(email)
        && validatePassword(password)) });
    });
    return value;
  };

  render() {
    const { email, password, isButtonValid } = this.state;
    return (
      <div>
        <h1>Login</h1>
        <input
          type="text"
          value={ email }
          name="email"
          data-testid="email-input"
          onChange={ this.handleChange }
        />
        <input
          type="text"
          data-testid="password-input"
          value={ password }
          name="password"
          onChange={ this.handleChange }
        />
        <button
          type="button"
          onClick={ () => this.handleSubmit() }
          disabled={ !isButtonValid }
        >
          Entrar
        </button>
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
export default connect(mapStateToProps)(Login);
