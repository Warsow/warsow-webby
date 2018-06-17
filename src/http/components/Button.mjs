import { html } from '../utils.mjs';
import Element from './Element.mjs';

/**
 * Button component
 *
 * Props:
 *   - href: <url>
 *   - color: <color name>
 *   - icon: <icon name>
 */
export default function Button(text, props = {}) {
  // Define classes
  const classNames = ['button', 'button-slanted'];
  if (props.primary) {
    classNames.push('button-primary');
  }
  if (props.secondary) {
    classNames.push('button-secondary');
  }
  if (props.color) {
    classNames.push('button-color-' + props.color);
  }
  if (props.icon) {
    classNames.push('button-icon');
  }
  if (props.flex) {
    classNames.push('button-flex');
  }
  // Define element type
  const elementType = props.elementType
    || (props.href && 'a')
    || 'span';
  // Make the button
  return Element(elementType, {
    classNames: classNames.concat(props.classNames),
    href: props.href,
    target: props.target,
    children: [
      text,
      props.icon && `<i class="icon mdi ${props.icon}"></i>`,
    ],
  });
}
