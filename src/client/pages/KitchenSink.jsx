import React, { Fragment } from 'react';
import { Button, Input } from '../components';

const COLOR_NAMES = [
  'red', 'orange', 'yellow', 'olive',
  'green', 'oceanic', 'teal',
  'blue', 'violet', 'purple', 'pink',
];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function KitchenSink(props) {
  return (
    <div className="Layout__container Layout__padded">
      <h1>Kitchen Sink</h1>
      <p>Hello world!</p>

      <h2>Buttons</h2>
      <div>
        <Button text="Normal" />
        <Button text="Primary" primary />
        <Button text="Secondary" secondary />
      </div>
      <div>
        {COLOR_NAMES.map(color =>
          <Button key={color}
            text={capitalize(color)}
            color={color} />
        )}
      </div>
      <div>
        {COLOR_NAMES.map(color =>
          <Button key={color} bright
            text={capitalize(color)}
            color={color} />
        )}
      </div>

      <h2>Slanted buttons</h2>
      <div>
        <Button slanted text="Button" />
        <Button slanted text="Button" primary />
        <Button slanted text="Button" secondary />
      </div>
      <div>
        {COLOR_NAMES.map(color =>
          <Button key={color} slanted
            text={capitalize(color)}
            color={color} />
        )}
      </div>
      <div>
        {COLOR_NAMES.map(color =>
          <Button key={color} slanted bright
            text={capitalize(color)}
            color={color} />
        )}
      </div>

      <h2>Underlined buttons</h2>
      <div>
        <Button underlined text="Button" />
        <Button underlined text="Button" primary />
        <Button underlined text="Button" secondary />
      </div>
      <div>
        {COLOR_NAMES.map(color =>
          <Button key={color} underlined
            text={capitalize(color)}
            color={color} />
        )}
      </div>
      <div>
        {COLOR_NAMES.map(color =>
          <Button key={color} underlined bright
            text={capitalize(color)}
            color={color} />
        )}
      </div>

      <h2>Inputs</h2>
      <div>
        <Button text="Underlined button" underlined />
        <Input label="Label" placeholder="Placeholder" />
        <Button text="Submit" />
      </div>
      <div>
        <Input label="Label" placeholder="Normal input" />
        <Input label="Label" placeholder="Fluid input" fluid />
      </div>

    </div>
  );
}
