import React from 'react';
import { Button, Link } from '../components';

export default function DownloadPage(props) {
  return (
    <div className="Layout__container Layout__container--text Layout__padded">
      <h1>Download</h1>
      <h2>Latest release: Warsow 2.1.2</h2>
      <div className="Grid Grid--flex">
        <Button as="a" slanted fluid secondary
          className="Grid__item"
          text="Windows"
          smallText="Windows installer (.exe)"
          icon="windows"
          href="http://sebastian.network/warsow/warsow-2.1.2-setup.exe" />
        <Button as="a" slanted fluid secondary
          className="Grid__item"
          text="Linux"
          smallText="Unified (Windows + Linux, tar.gz)"
          icon="linux"
          href="http://sebastian.network/warsow/warsow-2.1.2.tar.gz" />
        <Button as="a" slanted fluid secondary
          className="Grid__item"
          text="macOS"
          smallText="Disk image (.dmg)"
          icon="apple"
          href="http://sebastian.network/warsow/warsow-2.1.2.dmg" />
      </div>
      <h2>Other downloads</h2>
      <div>
        <Button as="a" underlined fluid
          text="Warsow 2.1 SDK"
          smallText="Source code and tools"
          icon="wrench"
          href="http://sebastian.network/warsow/warsow_21_sdk.tar.gz" />
        <Button as="a" underlined fluid
          text="data1_21pure.pk3"
          smallText="This pk3 fixes bugs with bomb gametype"
          icon="cube"
          href="http://sebastian.network/warsow/data1_21pure.pk3" />
        <Button as="a" underlined fluid
          text="data2_21pure.pk3"
          smallText="This pk3 fixes broken UI"
          icon="cube"
          href="http://sebastian.network/warsow/UIfix/data2_21pure.pk3" />
      </div>
    </div>
  );
}
