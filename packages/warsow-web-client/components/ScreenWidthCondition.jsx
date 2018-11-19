/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import React, { Component } from 'react';
import { throttle } from 'lodash';
import { classes } from '../utils.js';

export default class ScreenWidthCondition extends Component {

  constructor(props) {
    super(props);
    this.throttledUpdate = throttle(() => this.forceUpdate(), 500);
  }

  componentDidMount() {
    window.addEventListener('resize', this.throttledUpdate);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledUpdate);
  }

  render() {
    const { props } = this;
    const { test, render } = props;
    var width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    if (test(width)) {
      return render();
    }
    return null;
  }

}
