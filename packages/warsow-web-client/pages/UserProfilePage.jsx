/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import React from 'react';
import { MessageBox } from '../components';
import { flatConnect } from 'warsow-web-client/store';

export default flatConnect(
  (state, props) => ({
    user: state.get('users') && state.get('users')
      .find(x => x.get('username') === props.username),
  }),
  function UserProfilePage(props) {
    const { userId, user } = props;
    return (
      <div className="Layout__container Layout__container--text Layout__padded">
        <h1>Profile</h1>
        <MessageBox info
          title="Works in progress"
          text="Your registration has been accepted, but we're still figuring out what to do next." />
        <h2>Username</h2>
        <p>{user && user.get('username')}</p>
        <h2>Email</h2>
        <p>{user && user.get('email')}</p>
      </div>
    );
  }
)
