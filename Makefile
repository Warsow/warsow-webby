# Makefile

APP_NAME := webby
SHELL := /bin/bash

## Add binaries in node_modules to PATH
export PATH := $(PATH):node_modules/.bin

all: public/styles/main.css

## --------------------------------------------------------
##  File targets
## --------------------------------------------------------

node_modules:
	yarn install
	@touch node_modules

public/%.css: src/client/%.css
	mkdir -p $(@D)
	cp $< $@

%.css: %.scss
	sassc -t expanded $< $@


## --------------------------------------------------------
##  Phony targets
## --------------------------------------------------------

clean:
	@rm -rf public/styles .esm-cache

dbclean:
	@mongo --eval 'db.dropDatabase() && quit()' $(APP_NAME)

distclean: clean
	@rm -rf node_modules
