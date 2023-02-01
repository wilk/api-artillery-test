# API

## Testing via Artillery

The API is tested via `artillery`:

```bash
$ pnpm start # first run the server
$ pnpm test:api:load # second run the load-test
```

The config file is: `artillery/api-load.yml`

## API Rate Limiting

The API are limited using `express-rate-limit`

## API Rate Slow Down

The API are time-limited using `express-slow-down`
