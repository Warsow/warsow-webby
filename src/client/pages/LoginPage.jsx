import React, { Fragment } from 'react';
import { Button, Link, Input } from '../components';

export default function LoginPage(props) {
  return (
    <div className="Layout__container Layout__container--text Layout__padded">
      <h1>Log In</h1>
      <form>
        <Input fluid label="Username" />
        <Input fluid type="password" label="Password" />
        <Button as="button" type="submit" fluid fitted text="Log in" />
      </form>
    </div>
  );
}
