# Microservice Start Kit


## Description
The  microservice start kit is based on [Nestjs](https://github.com/nestjs/nest). Nestjs Documentation can be found [here](https://docs.nestjs.com/). The default database is postgres.

### Requirements
- [Postgres](https://wiki.postgresql.org/wiki/Homebrew)
- [Nodejs](https://nodejs.org/en/download/current/)
- To access postgres on MacOs. Kidnly install [Postico](https://eggerapps.at/postico/)

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Migrations

To create a new empty migration file under `src/database/migrations`
```
yarn create-migration -n CreateUserTable 
```

To generate a migration based on schema changes or addition of new entity
```
yarn gen-migration -n CreateUserTable 
```

To run migration
```
yarn migrate
```
