import { z } from 'zod'

const schema = z.object({
  DATABASE_URL: z
    .string()
    .default('postgres://anijinx:anijinx@localhost:5432/anijinx'),
  PORT: z.coerce.number().int().default(8787),
  CORS_ORIGIN: z.string().default('*'),
  MUX_TOKEN_ID: z.string().optional(),
  MUX_TOKEN_SECRET: z.string().optional(),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment:', z.treeifyError(parsed.error))
  throw new Error('Invalid environment')
}

export const env = parsed.data
