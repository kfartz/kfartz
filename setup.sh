#!/bin/bash

CIFAPI_DIR=$PWD/cif_api
ICU_DIR=$PWD/icu/icu4c/source
DEP_DIR=$PWD/.deps
BUN_VER=1.3.4
AM_VER=1.16.1

export CFLAGS="-I$DEP_DIR/include $CFLAGS"
export CXXFLAGS="-I$DEP_DIR/include $CXXFLAGS"
export LDFLAGS="-L$DEP_DIR/lib $LDFLAGS"
export PKG_CONFIG_PATH="$DEP_DIR/lib/pkgconfig:$PKG_CONFIG_PATH"
export PATH="$DEP_DIR/bin:$PATH"
export LD_LIBRARY_PATH="$DEP_DIR/lib:$LD_LIBRARY_PATH"

if [[ ! -d $DEP_DIR ]]; then
  git submodule update --init --recursive

  mkdir -p $DEP_DIR/bin $DEP_DIR/lib $DEP_DIR/include

  pushd $DEP_DIR

  curl -O0 -L https://github.com/oven-sh/bun/releases/download/bun-v$BUN_VER/bun-linux-x64-baseline.zip
  unzip bun-linux-x64-baseline.zip && rm bun-linux-x64-baseline.zip
  mv bun-linux-x64-baseline/bun bin/bun

  curl -O0 -L https://ftp.gnu.org/gnu/automake/automake-$AM_VER.tar.gz
  tar xf automake-$AM_VER.tar.gz && rm automake-$AM_VER.tar.gz

  pushd automake-$AM_VER

  ./configure --prefix=$PWD/../ && make $MAKEFLAGS && make install

  popd

  curl -O0 -L https://sqlite.org/2025/sqlite-amalgamation-3510100.zip
  unzip sqlite-amalgamation-3510100.zip && rm sqlite-amalgamation-3510100.zip

  pushd sqlite-amalgamation-3510100

  mv sqlite3.h $DEP_DIR/include/
  gcc -fPIC -shared -o $DEP_DIR/lib/libsqlite3.so sqlite3.c

  popd

  mkdir icu_build && pushd icu_build

  $ICU_DIR/configure --prefix=$DEP_DIR --enable-shared --disable-static && make $MAKEFLAGS && make install

  popd

  mkdir cif_api_build && pushd cif_api_build

  $CIFAPI_DIR/configure --prefix=$DEP_DIR --enable-shared --disable-static && make $MAKEFLAGS && make install

  popd

  rm -rf cif_api_build icu_build automake-$AM_VER sqlite-amalgamation-3510100 bun-linux-x64-baseline

  popd
fi
