// Adapted from https://github.com/dozoisch/react-google-recaptcha

import React from "react";
import PropTypes from "prop-types";


//  Recaptcha component
// --------------------------------------------------------

class ReCAPTCHA extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.handleExpired = this.handleExpired.bind(this);
    this.handleRecaptchaRef = this.handleRecaptchaRef.bind(this);
  }

  getValue() {
    if (this.props.grecaptcha && this.state.widgetId !== undefined) {
      return this.props.grecaptcha.getResponse(this.state.widgetId);
    }
    return null;
  }

  getWidgetId() {
    if (this.props.grecaptcha && this.state.widgetId !== undefined) {
      return this.state.widgetId;
    }
    return null;
  }

  execute() {
    const { grecaptcha } = this.props;
    const { widgetId } = this.state;

    if (grecaptcha && widgetId !== undefined) {
      return grecaptcha.execute(widgetId);
    } else {
      this._executeRequested = true;
    }
  }

  reset() {
    if (this.props.grecaptcha && this.state.widgetId !== undefined) {
      this.props.grecaptcha.reset(this.state.widgetId);
    }
  }

  handleExpired() {
    if (this.props.onExpired) {
      this.props.onExpired();
    } else if (this.props.onChange) {
      this.props.onChange(null);
    }
  }

  explicitRender(cb) {
    if (this.props.grecaptcha && this.props.grecaptcha.render && this.state.widgetId === undefined) {
      const wrapper = document.createElement("div");
      const id = this.props.grecaptcha.render(wrapper, {
        sitekey: this.props.sitekey,
        callback: this.props.onChange,
        theme: this.props.theme,
        type: this.props.type,
        tabindex: this.props.tabindex,
        "expired-callback": this.handleExpired,
        size: this.props.size,
        stoken: this.props.stoken,
        badge: this.props.badge,
      });
      this.captcha.appendChild(wrapper);

      this.setState({
        widgetId: id,
      }, cb);
    }
    if (this._executeRequested && this.props.grecaptcha && this.state.widgetId !== undefined) {
      this._executeRequested = false;
      this.execute();
    }
  }

  componentDidMount() {
    this.explicitRender();
  }

  componentDidUpdate() {
    this.explicitRender();
  }

  componentWillUnmount() {
    if (this.state.widgetId !== undefined) {
      while (this.captcha.firstChild) {
        this.captcha.removeChild(this.captcha.firstChild);
      }
      this.reset();
    }
  }

  handleRecaptchaRef(elem) {
    this.captcha = elem;
  }

  render() {
    // consume properties owned by the reCATPCHA, pass the rest to the div so the user can style it.
    /* eslint-disable no-unused-vars */
    const { sitekey, onChange, theme, type, tabindex, onExpired, size, stoken, grecaptcha, badge, ...childProps } = this.props;
    /* eslint-enable no-unused-vars */
    return (
      <div {...childProps} ref={this.handleRecaptchaRef} />
    );
  }
}

ReCAPTCHA.displayName = "ReCAPTCHA";
ReCAPTCHA.propTypes = {
  sitekey: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  grecaptcha: PropTypes.object,
  theme: PropTypes.oneOf(["dark", "light"]),
  type: PropTypes.oneOf(["image", "audio"]),
  tabindex: PropTypes.number,
  onExpired: PropTypes.func,
  size: PropTypes.oneOf(["compact", "normal", "invisible"]),
  stoken: PropTypes.string,
  badge: PropTypes.oneOf(["bottomright", "bottomleft", "inline"]),
};
ReCAPTCHA.defaultProps = {
  theme: "light",
  type: "image",
  tabindex: 0,
  size: "normal",
  badge: "bottomright",
};


//  Async loaded component
// --------------------------------------------------------

const callbackName = "onloadcallback";
const globalName = "grecaptcha";
const URL = `https://recaptcha.net/recaptcha/api.js?onload=${callbackName}&render=explicit`;

export default makeAsyncScriptLoader(ReCAPTCHA, URL, {
  callbackName,
  globalName,
  exposeFuncs: ["getValue", "getWidgetId", "reset", "execute"],
});


//  Async loader
// --------------------------------------------------------

let SCRIPT_MAP = {};

// A counter used to generate a unique id for each component that uses the function
let idCount = 0;

function makeAsyncScriptLoader(Component, scriptURL, options) {
  options = options || {};
  const wrappedComponentName = Component.displayName || Component.name || "Component";

  class AsyncScriptLoader extends React.Component {
    constructor() {
      super();
      this.state = {};
    }

    asyncScriptLoaderGetScriptLoaderID() {
      if (!this.__scriptLoaderID) {
        this.__scriptLoaderID = "async-script-loader-" + idCount++;
      }
      return this.__scriptLoaderID;
    }

    getComponent() {
      return this.childComponent;
    }

    componentDidMount() {
      const key = this.asyncScriptLoaderGetScriptLoaderID();
      const { globalName, callbackName } = options;
      if (globalName && typeof window[globalName] !== "undefined") {
        SCRIPT_MAP[scriptURL] = { loaded: true, observers: {} };
      }

      if (SCRIPT_MAP[scriptURL]) {
        let entry = SCRIPT_MAP[scriptURL];
        if (entry && (entry.loaded || entry.errored)) {
          this.asyncScriptLoaderHandleLoad(entry);
          return;
        }
        entry.observers[key] = (entry) => this.asyncScriptLoaderHandleLoad(entry);
        return;
      }

      let observers = {};
      observers[key] = (entry) => this.asyncScriptLoaderHandleLoad(entry);
      SCRIPT_MAP[scriptURL] = {
        loaded: false,
        observers,
      };

      let script = document.createElement("script");

      script.src = scriptURL;
      script.async = 1;

      let callObserverFuncAndRemoveObserver = (func) => {
        if (SCRIPT_MAP[scriptURL]) {
          let mapEntry = SCRIPT_MAP[scriptURL];
          let observersMap = mapEntry.observers;

          for (let obsKey in observersMap) {
            if (func(observersMap[obsKey])) {
              delete observersMap[obsKey];
            }
          }
        }
      };

      if (callbackName && typeof window !== "undefined") {
        window[callbackName] = AsyncScriptLoader.asyncScriptLoaderTriggerOnScriptLoaded;
      }

      script.onload = () => {
        let mapEntry = SCRIPT_MAP[scriptURL];
        if (mapEntry) {
          mapEntry.loaded = true;
          callObserverFuncAndRemoveObserver((observer) => {
            if (callbackName) {
              return false;
            }
            observer(mapEntry);
            return true;
          });
        }
      };
      script.onerror = (event) => {
        let mapEntry = SCRIPT_MAP[scriptURL];
        if (mapEntry) {
          mapEntry.errored = true;
          callObserverFuncAndRemoveObserver((observer) => {
            observer(mapEntry);
            return true;
          });
        }
      };

      // (old) MSIE browsers may call "onreadystatechange" instead of "onload"
      script.onreadystatechange = () => {
        if (this.readyState === "loaded") {
          // wait for other events, then call onload if default onload hadn't been called
          window.setTimeout(() => {
            const mapEntry = SCRIPT_MAP[scriptURL];
            if (mapEntry && mapEntry.loaded !== true) {
              script.onload();
            }
          }, 0);
        }
      };

      document.body.appendChild(script);
    }

    asyncScriptLoaderHandleLoad(state) {
      this.setState(state, this.props.asyncScriptOnLoad);
    }

    componentWillUnmount() {
      // Remove tag script
      if (options.removeOnUnmount === true) {
        const allScripts = document.getElementsByTagName("script");
        for (let i = 0; i < allScripts.length; i += 1) {
          if (allScripts[i].src.indexOf(scriptURL) > -1) {
            if (allScripts[i].parentNode) {
              allScripts[i].parentNode.removeChild(allScripts[i]);
            }
          }
        }
      }
      // Clean the observer entry
      let mapEntry = SCRIPT_MAP[scriptURL];
      if (mapEntry) {
        delete mapEntry.observers[this.asyncScriptLoaderGetScriptLoaderID()];
        if (options.removeOnUnmount === true) {
          delete SCRIPT_MAP[scriptURL];
        }
      }
    }

    render() {
      const globalName = options.globalName;
      // remove asyncScriptOnLoad from childprops
      let { asyncScriptOnLoad, ...childProps } = this.props;
      if (globalName && typeof window !== "undefined") {
        childProps[globalName] = typeof window[globalName] !== "undefined" ? window[globalName] : undefined;
      }
      return <Component ref={(comp) => { this.childComponent = comp; }} {...childProps} />;
    }
  }
  AsyncScriptLoader.displayName = `AsyncScriptLoader(${wrappedComponentName})`;
  AsyncScriptLoader.propTypes = {
    asyncScriptOnLoad: PropTypes.func,
  };
  AsyncScriptLoader.asyncScriptLoaderTriggerOnScriptLoaded = function () {
    let mapEntry = SCRIPT_MAP[scriptURL];
    if (!mapEntry || !mapEntry.loaded) {
      throw new Error("Script is not loaded.");
    }
    for (let obsKey in mapEntry.observers) {
      mapEntry.observers[obsKey](mapEntry);
    }
    delete window[options.callbackName];
  };

  if (options.exposeFuncs) {
    options.exposeFuncs.forEach(funcToExpose => {
      AsyncScriptLoader.prototype[funcToExpose] = function () {
        return this.getComponent()[funcToExpose](...arguments);
      };
    });
  }
  return AsyncScriptLoader;
}
