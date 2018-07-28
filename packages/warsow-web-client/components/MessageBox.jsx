import React from 'react';
import { classes } from '../utils.js';

export default function MessageBox(props) {
  const {
    // Custom behavior
    icon, info, warning, success, error,
    title, text, bulletPoints, content, children,
    // Passthrough
    ...rest
  } = props;
  const className = classes('MessageBox', props.className, [
    info && 'MessageBox--info',
    warning && 'MessageBox--warning',
    success && 'MessageBox--success',
    error && 'MessageBox--error',
  ]);
  return (
    <div {...rest} className={className}>
      {title && (
        <div className="MessageBox__title">
          {title}
        </div>
      )}
      <div className="MessageBox__text">
        {text}
        {bulletPoints && (
          <ul style={{ paddingBottom: 0 }}>
            {bulletPoints.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        )}
        {content}
        {children}
      </div>
    </div>
  );
}
