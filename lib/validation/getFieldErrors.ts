import { z, type ZodType } from "zod";

/**
 * Runs a schema and returns the first error message per field, keyed by field name —
 * ready to thread into FormField `errorMessage` props. Empty object means valid.
 */
export function getFieldErrors(
  schema: ZodType,
  values: unknown,
): Record<string, string> {
  const result = schema.safeParse(values);
  if (result.success) return {};

  const fieldErrors = z.flattenError(result.error).fieldErrors as Record<
    string,
    string[] | undefined
  >;
  const out: Record<string, string> = {};
  for (const key in fieldErrors) {
    const msgs = fieldErrors[key];
    if (msgs && msgs.length > 0) out[key] = msgs[0];
  }
  return out;
}
