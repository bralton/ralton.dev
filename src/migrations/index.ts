import * as migration_20260307_152231 from './20260307_152231'
import * as migration_20260308_223134 from './20260308_223134'
import * as migration_20260309_095049_add_contact_submissions from './20260309_095049_add_contact_submissions'
import * as migration_20260309_120634_add_social_links from './20260309_120634_add_social_links'
import * as migration_20260311_212816 from './20260311_212816'

export const migrations = [
  {
    up: migration_20260307_152231.up,
    down: migration_20260307_152231.down,
    name: '20260307_152231',
  },
  {
    up: migration_20260308_223134.up,
    down: migration_20260308_223134.down,
    name: '20260308_223134',
  },
  {
    up: migration_20260309_095049_add_contact_submissions.up,
    down: migration_20260309_095049_add_contact_submissions.down,
    name: '20260309_095049_add_contact_submissions',
  },
  {
    up: migration_20260309_120634_add_social_links.up,
    down: migration_20260309_120634_add_social_links.down,
    name: '20260309_120634_add_social_links',
  },
  {
    up: migration_20260311_212816.up,
    down: migration_20260311_212816.down,
    name: '20260311_212816',
  },
]
