import * as joi from '@hapi/joi';
import * as dotenv from 'dotenv';

process.env.ENV_PATH
  ? dotenv.config({ path: process.env.ENV_PATH })
  : dotenv.config();

// validating environment variables
const schema = joi
  .object({
    PORT: joi.number().required(),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'staging')
      .required(),
    LOG_LEVEL: joi
      .string()
      .valid('error', 'warning', 'info', 'debug', 'silly')
      .default('silly'),

    // database configs
    PGHOST: joi.string().required(),
    PGUSER: joi.string().required(),
    PGPASSWORD: joi.string().required(),
    PGDATABASE: joi.string().required(),
    PGPORT: joi
      .number()
      .port()
      .required()
      .default(5432),
    DATABASE_LOGGING: joi
      .boolean()
      .truthy('TRUE')
      .truthy('true')
      .falsy('FALSE')
      .falsy('false')
      .default(false),

    USER_SVC: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = schema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  isDevelopment: envVars.NODE_ENV === 'development' ? true : false,
  port: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,

  db: {
    port: envVars.PGPORT,
    host: envVars.PGHOST,
    username: envVars.PGUSER,
    password: envVars.PGPASSWORD,
    name: envVars.PGDATABASE,
    logging: envVars.DATABASE_LOGGING,
  },

  userSvc: envVars.USER_SVC,
};
