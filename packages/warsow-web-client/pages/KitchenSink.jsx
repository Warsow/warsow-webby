import React from 'react';
import { Button, Input, Link, MessageBox } from '../components';
import { flatConnect } from '../store';

const COLOR_NAMES = [
  'red', 'orange', 'yellow', 'olive',
  'green', 'oceanic', 'teal',
  'blue', 'violet', 'purple', 'pink',
];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default flatConnect(
  function KitchenSink(props) {
    const { dispatch } = props;
    return (
      <div className="Layout__container Layout__padded">
        <h1>Kitchen Sink</h1>
        <p>Hello world!</p>

        <h2>Livesow</h2>
        <div>
          <Button text="Connect"
            onClick={() => {
              dispatch({
                type: 'LIVESOW_START',
              });
            }} />
          <Button text="Disconnect"
            onClick={() => {
              dispatch({
                type: 'LIVESOW_STOP',
              });
            }} />
        </div>

        <h2>Links</h2>
        <div>
          <Link href="javascript:">This is a link</Link>
        </div>

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
          <Input placeholder="Without label" />
          <Input fluid label="Label" placeholder="Fluid input" />
        </div>
        <div>
          <Input fluid placeholder="Without label" />
          <Input fluid placeholder="Without label" />
        </div>

        <h2>Message boxes</h2>
        <MessageBox
          title="Default message"
          text="Main body of the message" />
        <MessageBox info
          title="Info message"
          text="Main body of the message" />
        <MessageBox warning
          title="Warning message"
          text="Main body of the message" />
        <MessageBox success
          title="Success message"
          text="Main body of the message" />
        <MessageBox error
          title="Error message"
          text="Main body of the message" />

      </div>
    );
  }
);
