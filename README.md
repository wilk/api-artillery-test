# API

## Requirements

- PNPM
- NVM

## Align Node.js

```bash
$ nvm use
```

## Install deps

```bash
$ pnpm i
```

## Prepare the dbs

### Schema

Local & test db:

```bash
$ pnpm db:migrate
```

This will produce two database files in the `data` folder: one for the local development and another one for testing

### Seed

```bash
$ pnpm db:seed
```

## Generate auth tokens

```bash
$ pnpm generate-tokens
```

Inside the `artillery/api-load.yml` file, replace `REPLACE_ME_WITH_A_REAL_TOKEN` with one of the generated tokens.

## Prepare env vars

```bash
$ cp .env.sample .env
```

Then replace `JWT_SECRET` with a real one.

## Testing

```bash
$ pnpm test
```

## Testing via Artillery

Test the API via `artillery`:

```bash
$ pnpm start # first run the server
$ pnpm test:api:load # second run the load-test
```

The config file is: `artillery/api-load.yml`

## API Rate Limiting

The API are limited using `express-rate-limit`

## API Rate Slow Down

The API are time-limited using `express-slow-down`
