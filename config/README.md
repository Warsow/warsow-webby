# Configuration files

These files are used to configure the server and its integrations with various
external services. All configuration files operate on the same set of options.

When application loads the config, it sequentially merges all options from:

- `default.yaml`
- `local.yaml` / `production.yaml`
- `override.yaml`

Consequently, options in `override.yaml` have the highest priority, and options
in `default.yaml` have the lowest priority.

File `override.yaml` is the only file that is not tracked by git, so create this file
if you want to enter custom configuration, e.g. provide API keys.
