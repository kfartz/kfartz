#!/bin/bash

DEPDIR=$PWD/.deps
BUNVER=1.3.4
AMVER=1.16.1

if [[ ! -d $DEPDIR ]]; then
  mkdir -p $DEPDIR/bin

  pushd $DEPDIR

  curl -O0 -L https://github.com/oven-sh/bun/releases/download/bun-v$BUNVER/bun-linux-x64-baseline.zip
  unzip bun-linux-x64-baseline.zip && rm bun-linux-x64-baseline.zip
  ln bun-linux-x64-baseline/bun bin/bun

  curl -O0 -L https://ftp.gnu.org/gnu/automake/automake-$AMVER.tar.gz
  tar xf automake-$AMVER.tar.gz && rm automake-$AMVER.tar.gz

  pushd automake-$AMVER

  ./configure --prefix=$PWD/../ && make && make install

  popd

  popd
fi

export PATH="$DEPDIR/bin:$PATH"
# Install libcif
CIFLIB_DIR=$PWD/cif_api
if [[ ! -d $DEPDIR/lib ]]; then
  git submodule update --init --recursive

  mkdir $DEPDIR/cif_api_build && pushd $DEPDIR/cif_api_build

  $CIFLIB_DIR/configure --prefix=$DEPDIR && make && make install

  popd
fi

export LD_LIBRARY_PATH="$DEPDIR/lib:$LD_LIBRARY_PATH"
