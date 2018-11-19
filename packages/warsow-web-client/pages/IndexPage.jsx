/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import React from 'react';
import { Button, Link } from '../components';
import ScreenWidthCondition from '../components/ScreenWidthCondition';

// (function () {
//   var element = document.getElementsByClassName('Greeting__arrow')[0];
//   var onScroll = function () {
//     element.style.opacity = 0;
//     window.removeEventListener('scroll', onScroll);
//   };
//   if (window.scrollY !== 0) {
//     return onScroll();
//   }
//   window.addEventListener('scroll', onScroll);
// })();

export default function KitchenSink(props) {
  return (
    <div>
      <div className="Greeting">
        <ScreenWidthCondition
          test={width => width > 896}
          render={() =>
            <video className="Greeting__background-video"
              playsInline autoPlay muted loop>
              <source src="/videos/warsow-background-video.mp4" type="video/mp4" />
              <source src="/videos/warsow-background-video.webm" type="video/webm" />
            </video>
          } />
        <div className="Greeting__arrow">
          <i className="icon arrow down" />
        </div>
        <div className="Greeting__stripe">
          <div className="Greeting__flex Layout__container">
            <div className="Greeting__text">
              <h1>The fastest sport on the web!</h1>
              <p>
                Set in a futuristic cartoonish world, Warsow is a completely free
                fast-paced first-person shooter (FPS) for Windows, Linux and macOS.
              </p>
              <p>
                Join us on:&nbsp;
                <Button as={Link}
                  text="Discord"
                  color="discord"
                  icon="discord"
                  href="https://discord.gg/4t65eJE"
                  target="_blank" />
                <Button as={Link}
                  text="Reddit"
                  color="reddit"
                  icon="reddit"
                  href="https://www.reddit.com/r/warsow/"
                  target="_blank" />
              </p>
            </div>
            <div className="Greeting__download">
              <Button as={Link} slanted fluid fitted secondary
                className="text-center"
                routeName="download"
                text="Download"
                icon="download" />
            </div>
          </div>
        </div>
      </div>

      <div className="Motto">
        <div className="Layout__container">
          <div className="Motto__header">
            <h1>Warsow is Art of Respect and Sportsmanship Over the Web</h1>
            <img src="/images/health.svg" alt="Mega health"
              style={{
                width: '3em',
                height: '3em',
              }} />
          </div>
          <div className="Motto__quote">
            <div className="Motto__quote-author">
              <div className="Motto__quote-symbol">&#8221;</div>
              <div className="text-big">Fabrice Demurger</div>
              <div className="text-small">Warsow founder</div>
            </div>
            <div className="Motto__quote-body">
              <p>
                Since 2005, Warsow is considered as one of the most skill-demanding
                games in the fast-paced arena shooter scene. If you're looking for
                some challenge or old-skool and hardcore gameplay, you came to the
                right place!
              </p>
              <p>
                Here's a few tips that will improve your gaming experience in Warsow:
              </p>
              <ul>
                <li>GL, HF &amp; GG - these are the fundamentals of esports. It never hurts to say them;</li>
                <li>Each loss is an opportunity to improve your skills and game knowledge;</li>
                <li>Each win is an opportunity to share your game knowledge with the others!</li>
              </ul>
              <p>
                Thanks for your attention and once again, welcome to Warsow!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="Spacing" />

      <div className="Layout__container Layout__container--text">
        <h1 className="text-center">What is Warsow?</h1>
        <p>
          <i>Speed and movement is what Warsow is all about.</i>
        </p>
        <p>
          Like a true cyberathlete you jump, dash, dodge, and walljump your way
          through the game. Grab power-ups before your enemy does, plant a bomb
          before anyone sees you, and steal the enemy’s flag before they know what
          is going on!
        </p>
        <p>
          Our goal is to offer a fast and fun competitive first-person shooter
          without hard graphical violence - Warsow has no blood or guts flying around.
          Red circles instead of blood indicate hits and colored triangles replace
          guts as gib effects.
        </p>
        <p>
          We put a great emphasis on extreme customazibility and e-sports features.
        </p>
      </div>

      <div className="Spacing Spacing--big Spacing--divider" />

      <div className="Layout__container text-center">
        <Button as={Link} slanted secondary
          routeName="download"
          text="Download now!"
          icon="download" />
      </div>

    </div>
  );
}
