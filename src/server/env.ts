/**
 * Define your environment variables here
 *
 * Access these in your API (fully type-safe):
 * @see https://hono.dev/docs/helpers/adapter#env
 */

export type Bindings = {
  DATABASE_URL: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  QSTASH_URL: string;
};
