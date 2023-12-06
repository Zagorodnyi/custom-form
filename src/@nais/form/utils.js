import { ZodSchema } from 'zod'

/**
 *
 * @param {ZodSchema | Object} v
 * @param {Object} validators
 * @returns {import('./Form').Schema | import('./Form').Children<v>}
 */
export function required(v, validators = {}) {
  if (v instanceof ZodSchema) {
    return {
      schema: v,
      ...validators
    }
  }
  return {
    children: v
  }
}

/**
 *
 * @param {ZodSchema | Object} v
 * @param {Object} validators
 * @returns {import('./Form').Schema | import('./Form').Children<v>}
 */
export function optional(v, validators = {}) {
  if (v instanceof ZodSchema) {
    return {
      schema: v.optional(),
      ...validators
    }
  }

  return {
    children: v
  }
}
