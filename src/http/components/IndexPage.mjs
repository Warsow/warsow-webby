import { html } from '../utils.mjs';
import Button from './Button.mjs';

export default function IndexPage() {
  return html`
    <div class="greeting">
      <div class="greeting-arrow">
        <i class="mdi mdi-arrow-down"></i>
      </div>
      <script>
        (function () {
          var element = document.getElementsByClassName('greeting-arrow')[0];
          var onScroll = function () {
            element.style.opacity = 0;
            window.removeEventListener('scroll', onScroll);
          };
          if (window.scrollY !== 0) {
            return onScroll();
          }
          window.addEventListener('scroll', onScroll);
        })();
      </script>
      <div class="greeting-stripe">
        <div class="greeting-flex container">
          <div class="greeting-text">
            <h1>The fastest sport on the web!</h1>
            <p>
              Set in a futuristic cartoonish world, Warsow is a completely free
              fast-paced first-person shooter (FPS) for Windows, Linux and macOS.
            </p>
            <p>
              Join us on:
              ${Button('Discord', {
                color: 'discord',
                icon: 'mdi-discord',
                href: 'https://discord.gg/4t65eJE',
                target: '_blank',
              })}
              ${Button('Reddit', {
                color: 'reddit',
                icon: 'mdi-reddit',
                href: 'https://www.reddit.com/r/warsow/',
                target: '_blank',
              })}
            </p>
          </div>
          <div class="greeting-download">
            ${Button('Download', {
              classNames: ['text-center'],
              color: 'purple',
              icon: 'mdi-download',
              href: '/download',
              flex: true,
            })}
          </div>
        </div>
      </div>
    </div>

    <div class="motto">
      <div class="container">
        <div class="motto-header">
          <h1>Warsow is Art of Respect and Sportsmanship Over the Web</h1>
          <img src="/images/health.svg" style="width: 3em; height: 3em">
        </div>
        <div class="motto-quote">
          <div class="motto-quote-author">
            <div class="motto-quote-symbol">&#8221;</div>
            <div class="text-big">Fabrice Demurger</div>
            <div class="text-small">Warsow founder</div>
          </div>
          <div class="motto-quote-body">
            <p>
              Since 2005, Warsow is considered as one of the most skill-demanding
              games in the fast-paced arena shooter scene. If you're looking for
              some challenge or old-skool and hardcore gameplay, you came to the
              right place!
            </p>
            <p>
              Here's a few tips that will improve your gaming experience in Warsow:
              <ul>
                <li>GL, HF &amp; GG - these are the fundamentals of esports. It never hurts to say them;</li>
                <li>Each loss is an opportunity to improve your skills and game knowledge;</li>
                <li>Each win is an opportunity to share your game knowledge with the others!</li>
              </ul>
            </p>
            <p>
              Thanks for your attention and once again, welcome to Warsow!
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="divider divider-hidden"></div>

    <div class="container container-text">
      <h1 class="text-center">What is Warsow?</h1>
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
        We put great emphasis on extreme customazibility, e-sports features
        for players and enthusiast modders.
      </p>
    </div>

    <div class="divider divider-big"></div>

    <div class="container text-center">
      ${Button('Download now!', {
        color: 'purple',
        icon: 'mdi-download',
        href: '/download',
      })}
    </div>

    <div class="divider divider-big divider-hidden"></div>

    <div class="container text-center text-dimmed">
      Chasseur de Bots, ${(new Date()).getFullYear()} ©
    </div>
  `;
}
