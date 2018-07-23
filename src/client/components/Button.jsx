import React from 'react';

export default function Button(props) {
  const classNames = ['button'];
  if (props.slanted) {
    classNames.push('button-slanted');
  }
  if (props.primary) {
    classNames.push('button-primary');
  }
  if (props.secondary) {
    classNames.push('button-secondary');
  }
  if (props.color) {
    classNames.push('button-color-' + props.color);
  }
  return (
    <div className={classNames.join(' ')}>
      {props.text}
      {props.children}
    </div>
  );
}
