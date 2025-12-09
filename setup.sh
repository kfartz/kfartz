#!/bin/bash

# Install libcif 
CIFLIB_DIR=cif_api
if [[ ! -d $CIFLIB_DIR ]]; then
    git submodules update --init --recursive
    pushd $CIFLIB_DIR

    ./configure && make

    popd
fi

export LD_LIBRARY_PATH="$PWD/$CIFLIB_DIR/src/.lib:$LD_LIBRARY_PATH"

# Install bun 

BUNDIR=.bun
BUNVER=1.3.4

if [[ ! -d $BUNDIR ]]; then
    mkdir $BUNDIR

    pushd $BUNDIR
    
    curl -O0 -L https://github.com/oven-sh/bun/releases/download/bun-v$BUNVER/bun-linux-x64-baseline.zip
    
    unzip bun-linux-x64-baseline.zip

    rm bun-linux-x64-baseline.zip
    
    popd
fi

export PATH="$PWD/$BUNDIR/bun-linux-x64-baseline:$PATH"
