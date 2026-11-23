import Constants from 'expo-constants';
import { Platform } from 'react-native';

type Fields = Record<string, unknown>;

const baseContext: Fields = {
  platform: Platform.OS,
  appVersion: Constants.expoConfig?.version ?? 'unknown',
};

const compact = (fields: Fields): Fields =>
  Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));

// Supabase returns plain objects carrying code/details/hint instead of Error
// instances, so copy the queryable fields rather than the raw value.
const describeError = (error: unknown): Fields => {
  if (error === null || typeof error !== 'object') {
    return { message: String(error) };
  }
  const { name, message, code, status, details, hint } = error as Record<string, unknown>;
  return compact({
    name,
    message,
    code: code as string | number | undefined,
    status: status as number | undefined,
    details,
    hint,
  });
};

const emit = (level: 'info' | 'error', scope: string, message: string, fields: Fields) => {
  const { error, ...rest } = fields;
  const event = compact({
    ...baseContext,
    scope,
    ...rest,
    error: error === undefined ? undefined : describeError(error),
  });

  if (level === 'error') {
    console.error(message, event);
  } else {
    console.log(message, event);
  }
};

export function createLogger(scope: string) {
  return {
    info: (message: string, fields: Fields = {}) => emit('info', scope, message, fields),
    error: (message: string, fields: Fields = {}) => emit('error', scope, message, fields),
  };
}
