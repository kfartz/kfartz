#!/bin/bash

BUN_VER=1.3.4

export PATH="$DEP_DIR/bin:$PATH"

if [[ ! -d $DEP_DIR ]]; then
  mkdir -p $DEP_DIR/bin

  pushd $DEP_DIR

  curl -O0 -L https://github.com/oven-sh/bun/releases/download/bun-v$BUN_VER/bun-linux-x64-baseline.zip
  unzip bun-linux-x64-baseline.zip && rm bun-linux-x64-baseline.zip
  mv bun-linux-x64-baseline/bun bin/bun

  rm -rf bun-linux-x64-baseline

  popd
fi
