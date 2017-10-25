# Webby

## Pre-requisites

* Node.js `^8.7`
* Yarn `^1.2`
* SassC (based on libsass)
* GNU Make


## Setup

Run a development server:

```
bin/webby --dev
```

It will install extra dependencies automatically, and will compile all the
necessary source code to render webby correctly.


## Make targets

- `make` - build all
- `make clean` - clean build artifacts
- `make distclean` - clean everything
