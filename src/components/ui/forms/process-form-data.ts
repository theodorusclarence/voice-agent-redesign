import { type FieldValues, type SubmitHandler } from 'react-hook-form';

/**
 * Normalizes form data before it reaches the submit handler:
 * empty (or whitespace-only) strings become `undefined` so optional
 * fields don't submit as `''`.
 */
export function processFormData<T extends FieldValues>(
  handler: SubmitHandler<T>
) {
  return (data: T) => {
    const processedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        typeof value === 'string' && value.trim() === '' ? undefined : value,
      ])
    ) as T;

    return handler(processedData);
  };
}
