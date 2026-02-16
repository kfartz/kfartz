import * as migration_20260220_111220 from './20260220_111220';

export const migrations = [
  {
    up: migration_20260220_111220.up,
    down: migration_20260220_111220.down,
    name: '20260220_111220'
  },
];
