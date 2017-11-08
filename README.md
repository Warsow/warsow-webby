# Webby

## Pre-requisites

* Node.js `^8.7`
* Yarn `^1.2`

## Usage

### `bin/webby`

Runs a production server. Creates a UNIX socket `server.socket` which you can
attach to nginx.

- [Sample nginx config](config/nginx)
- [Installing a systemd service](config/systemd/README.md)

### `bin/webby --dev`

Runs a full development server. Will listen on port 3000.

### `bin/webby --kitchen-sink` or `yarn start`

Runs a more lightweight "kitchen-sink" server. This is best suited for
experimenting with frontend elements, when full server is not needed.

The page is located at `public/kitchen-sink.html`, and it uses frontend sources
from `src/client`. Just remember to not open the page itself, but go to
`http://localhost:3000/`.

### `bin/webby --build`

Runs a full build of frontend components. Places results in `public/bundles`.

### `bin/webby --clean`

Cleans up everything to a pristine state.
