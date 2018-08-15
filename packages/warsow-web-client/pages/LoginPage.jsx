import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Button, Link, Form, Input, MessageBox } from '../components';
import { connect, authActions } from '../store';

@connect(
  state => ({
    error: state.getIn(['auth', 'error']),
  }),
  dispatch => ({
    authActions: bindActionCreators(authActions, dispatch),
  })
)
export default class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
    };
    // Event handlers
    this.onSubmit = e => {
      console.log('Submitting...');
      const { authActions } = this.props;
      const { username, password } = this.state;
      authActions.login(username, password);
    };
  }

  render() {
    const { error, verified } = this.props;
    return (
      <div className="Layout__container Layout__container--text Layout__padded">
        <h1>Log In</h1>
        {verified && (
          <MessageBox success
            title="Email verification successful"
            text="You can now login to your account" />
        )}
        {error && (
          <MessageBox error
            title={error.get('message')}
            bulletPoints={error.get('extra')} />
        )}
        <p>
          <Link routeName="registration" content="Create a new account" />
        </p>
        <Form onSubmit={this.onSubmit}>
          <Input fluid label="Username"
            autoComplete="username"
            onChange={e => {
              this.setState({
                username: e.target.value,
              });
            }} />
          <Input fluid type="password" label="Password"
            autoComplete="current-password"
            onChange={e => {
              this.setState({
                password: e.target.value,
              });
            }} />
          <Button as="button" type="submit" fluid fitted text="Log in" />
        </Form>
      </div>
    );
  }
}
