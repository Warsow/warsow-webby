import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Button, Link, Form, Input, Recaptcha, MessageBox } from '../components';

const { RECAPTCHA_SITE_KEY } = process.env;

export default class RegisterPage extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
      captcha: null,
    };
    // Event handpers
    this.onSubmit = async e => {
      const { state } = this;
      e.preventDefault();
      console.log('register:submit', state);
      try {
        const res = await axios({
          method: 'post',
          url: '/api/createUser',
          data: state,
        });
        console.log('register:res', res);
        this.setState({
          messageBox: {
            success: true,
            title: 'Registration successful',
          },
        });
      }
      catch (err) {
        const res = err.response;
        if (res && res.data.error) {
          this.setState({
            messageBox: {
              error: true,
              title: res.data.message,
              bulletPoints: res.data.extra,
            },
          });
        }
      }
    };
  }

  render() {
    const { props, state } = this;
    return (
      <div className="Layout__container Layout__container--text Layout__padded">
        <h1>Register</h1>
        <Form onSubmit={this.onSubmit}>
          {state.messageBox && (
            <MessageBox {...state.messageBox} />
          )}
          <Input fluid
            autoComplete="off"
            name="email"
            label="Email"
            onChange={e => {
              this.setState({
                email: e.target.value,
              });
            }} />
          <Input fluid
            autoComplete="off"
            name="username"
            label="Username"
            onChange={e => {
              this.setState({
                username: e.target.value,
              });
            }} />
          <Input fluid type="password"
            autoComplete="off"
            name="password"
            label="Password"
            onChange={e => {
              this.setState({
                password: e.target.value,
              });
            }} />
          <Input fluid type="password"
            autoComplete="off"
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
