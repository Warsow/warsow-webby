import React from 'react';
import Button from './Button.jsx';
import Input from './Input.jsx';

export default function Form(props) {
  const {
    // Custom behavior
    onSubmit,
    // Passthrough
    ...rest
  } = props;
  return (
    <form {...rest}
      onSubmit={e => {
        e.preventDefault();
        onSubmit && onSubmit(e);
      }} />
  );
}

Form.Button = Button;
Form.Input = Input;
