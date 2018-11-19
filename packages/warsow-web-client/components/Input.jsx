/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import React, { Component } from 'react';
import { createUuid } from 'warsow-common/uuid';
import { classes } from '../utils.js';

export default class Input extends Component {

  static defaultProps = {
    role: 'textbox',
    type: 'text',
  };

  constructor(props) {
    super(props);
    this.state = {
      uuid: createUuid(),
    };
  }

  render() {
    const { props, state } = this;
    const {
      // Custom behavior
      as, icon, slanted, underlined, fluid, color, label,
      // Passthough
      ...rest
    } = props;
    const ElementType = props.as || 'div';
    const className = classes('Input', props.className, [
      slanted && 'Input--slanted',
      underlined && 'Input--underlined',
      fluid && 'Input--fluid',
      color && 'Input--color-' + color,
    ]);
    return (
      <ElementType className={className}>
        {icon && (
          <i className={'Input__icon icon ' + icon} />
        )}
        {label && (
          <label className="Input__label"
            htmlFor={state.uuid}>
            {label}
          </label>
        )}
        <input className="Input__element"
          id={state.uuid}
          {...rest} />
      </ElementType>
    );
  }

}
