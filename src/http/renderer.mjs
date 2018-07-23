import Layout from './components/Layout.mjs';

/**
 * Create a render function for rendering templates.
 *
 * It is necessary to abstract away the layout, and inject various runtime
 * specific variables into it.
 */
export function createRenderer() {
  return async (req, maybeComponent, props = {}) => {
    let content = null;
    // Resolve a possible promise
    let component = await Promise.resolve(maybeComponent);
    // Component was passed as a module
    if (component && typeof component.default === 'function') {
      content = component.default(props);
    }
    // Component was passed directly
    else if (typeof component === 'function') {
      content = component(props);
    }
    // Assume this is a string
    else {
      content = component;
    }
    return Layout({
      content,
      route: req.path,
      livereload: process.env.APP_ENV === 'local',
    });
  }
}
