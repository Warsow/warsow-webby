# Webby


## Pre-requisites

* Node.js `^10.6.0`
* Yarn `^1.3.2`


## Usage

### `bin/webby`

Runs a production server. Creates a UNIX socket `server.socket` which you can
attach to nginx.

You can change the path to unix socket or the port by setting the `PORT` environment
variable. For example, if you run `PORT=3000 bin/webby`, it will listen on the port 3000.

- [Sample nginx config](config/nginx)
- [Installing a systemd service](config/systemd/README.md)

### `bin/webby --dev` or `yarn start`

Runs a full development server. Will listen on port 3000 by default.

### `bin/webby --build` or `yarn build`

Runs a full build of frontend components. Places results in `public/bundles`.

### `bin/webby --clean`

Removes build artifacts.

### `bin/webby --dbclean`

Removes all persisted state (database, generated encryption keys).

### `bin/webby --distclean`

Removes everything that is not tracked by the version control system, leaving you with
the clean source code.


## License

Source code is provided under GPL 2.0 or later license.

> SPDX-License-Identifier: GPL-2.0-or-later

In addition, other licenses may also apply.
