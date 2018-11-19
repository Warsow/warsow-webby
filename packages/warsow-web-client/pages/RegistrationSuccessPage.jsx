/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import React from 'react';
import { MessageBox } from '../components';

export default function RegistrationSuccessfulPage(props) {
  return (
    <div className="Layout__container Layout__container--text Layout__padded">
      <h1>Register</h1>
      <MessageBox success
        title="Registration successful"
        text="A verification link has been sent to your email account." />
    </div>
  );
}
