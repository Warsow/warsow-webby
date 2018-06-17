'use strict';

import React from 'react';

export default class Button extends React.Component {

  render() {
    const classNames = ['button'];
    if (this.props.slanted) {
      classNames.push('button-slanted');
    }
    if (this.props.primary) {
      classNames.push('button-primary');
    }
    if (this.props.secondary) {
      classNames.push('button-secondary');
    }
    if (this.props.color) {
      classNames.push('button-color-' + this.props.color);
    }
    return (
      <div className={classNames.join(' ')}>
        {this.props.text}
        {this.props.children}
      </div>
    );
  }

}
