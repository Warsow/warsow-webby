/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Button, Link, Form, Input, Recaptcha, MessageBox } from '../components';
import { connect, authActions } from '../store';

const { RECAPTCHA_SITE_KEY } = process.env;

@connect(
  state => ({
    error: state.getIn(['auth', 'error']),
  }),
  dispatch => ({
    authActions: bindActionCreators(authActions, dispatch),
  })
)
export default class RegistrationPage extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
      captcha: null,
    };
    // Event handlers
    this.onSubmit = e => {
      const { authActions } = this.props;
      authActions.register(this.state);
    };
  }

  render() {
    const { error } = this.props;
    return (
      <div className="Layout__container Layout__container--text Layout__padded">
        <h1>Register</h1>
        <Form onSubmit={this.onSubmit}>
          {error && (
            <MessageBox error
              title={error.get('message')}
              bulletPoints={error.get('extra')} />
          )}
          <Input fluid
            autoComplete="email"
            name="email"
            label="Email"
            onChange={e => {
              this.setState({
                email: e.target.value,
              });
            }} />
          <Input fluid
            autoComplete="username"
            name="username"
            label="Username"
            onChange={e => {
              this.setState({
                username: e.target.value,
              });
            }} />
          <Input fluid type="password"
            autoComplete="new-password"
            name="password"
            label="Password"
            onChange={e => {
              this.setState({
                password: e.target.value,
              });
            }} />
          <Input fluid type="password"
            autoComplete="new-password"
            name="password-confirm"
            label="Repeat password"
            onChange={e => {
              this.setState({
                passwordConfirm: e.target.value,
              });
            }} />
          <Recaptcha theme="dark"
            style={{ paddingBottom: '0.5rem' }}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={captcha => {
              console.log('captcha', captcha);
              this.setState({ captcha });
            }} />
          <Button as="button" type="submit" fluid fitted
            text="Register" />
        </Form>
      </div>
    );
  }
}
