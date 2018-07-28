import React from 'react';
import { classes } from '../utils.js';

export default function Button(props) {
  const {
    // Custom behavior
    as, icon, slanted, underlined, fluid, fitted, primary, secondary, bright, color,
    text, smallText, content, children,
    // Passthrough
    ...rest
  } = props;
  const ElementType = props.as || (props.href && 'a') || 'button';
  const className = classes('Button', props.className, [
    slanted && 'Button--slanted',
    underlined && 'Button--underlined',
    fluid && 'Button--fluid',
    fitted && 'Button--fitted',
    primary && 'Button--primary',
    secondary && 'Button--secondary',
    bright && 'Button--bright',
    color && 'Button--color-' + color,
  ]);
  return (
    <ElementType {...rest} className={className}>
      {icon && (
        <i className={'Button__icon icon ' + icon} />
      )}
      {text}
      {smallText && (
        <div className="Button__small-text">
          {smallText}
        </div>
      )}
      {children || content}
    </ElementType>
  );
}

Button.defaultProps = {
  role: 'button',
};
