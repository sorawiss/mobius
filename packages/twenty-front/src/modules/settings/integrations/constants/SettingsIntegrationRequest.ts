import { type SettingsIntegrationCategory } from '@/settings/integrations/types/SettingsIntegrationCategory';

export const SETTINGS_INTEGRATION_REQUEST_CATEGORY: SettingsIntegrationCategory =
  {
    key: 'request',
    title: 'ขอเพิ่มการเชื่อมต่อ',
    hyperlink: null,
    integrations: [
      {
        from: { key: 'github', image: '/images/integrations/github-logo.png' },
        to: null,
        type: 'Goto',
        text: 'ขอเพิ่มการเชื่อมต่อผ่าน GitHub Discussions',
        link: 'https://github.com/twentyhq/twenty/discussions/categories/ideas',
        linkText: 'ไปที่ GitHub',
      },
    ],
  };
