#!/bin/sh

bun run build
bun run payload migrate
bun run start
