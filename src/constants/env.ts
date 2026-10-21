import { Platform } from 'react-native';

export type AppEnv =
  | 'development'
  | 'staging'
  | 'production';

export const APP_ENV: AppEnv = __DEV__
  ? 'development'
  : 'production';

const DEV_API_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
});

const API_URLS: Record<AppEnv, string> = {
  development: DEV_API_URL,

  // Điền URL thật khi có server staging/production.
  staging: DEV_API_URL,
  production: DEV_API_URL,
};

export const API_BASE_URL = API_URLS[APP_ENV];

export const ENABLE_CRASHLYTICS =
  APP_ENV !== 'development';

export const ENABLE_OTA_UPDATE =
  APP_ENV !== 'development';

export const APP_VERSION = '1.0.0';
