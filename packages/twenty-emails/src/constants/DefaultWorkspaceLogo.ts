const DEFAULT_CDN_WORKSPACE_LOGO =
  'https://app.mobius.com/images/icons/android/android-launchericon-192-192.png';

const DEFAULT_SERVER_LOGO_PATH = '/public/images/icons/mobius-email-logo.png';

const normalizedServerUrl = process.env.SERVER_URL
  ? process.env.SERVER_URL.replace(/\/$/, '')
  : undefined;

export const DEFAULT_WORKSPACE_LOGO = normalizedServerUrl
  ? `${normalizedServerUrl}${DEFAULT_SERVER_LOGO_PATH}`
  : DEFAULT_CDN_WORKSPACE_LOGO;
