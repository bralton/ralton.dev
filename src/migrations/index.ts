import * as migration_20260307_152231 from './20260307_152231';
import * as migration_20260308_223134 from './20260308_223134';

export const migrations = [
  {
    up: migration_20260307_152231.up,
    down: migration_20260307_152231.down,
    name: '20260307_152231',
  },
  {
    up: migration_20260308_223134.up,
    down: migration_20260308_223134.down,
    name: '20260308_223134'
  },
];
