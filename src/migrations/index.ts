import * as migration_20260224_140411 from './20260224_140411';

export const migrations = [
  {
    up: migration_20260224_140411.up,
    down: migration_20260224_140411.down,
    name: '20260224_140411'
  },
];
