import { type SettingsIntegrationCategory } from '@/settings/integrations/types/SettingsIntegrationCategory';

export const SETTINGS_INTEGRATION_ZAPIER_CATEGORY: SettingsIntegrationCategory =
  {
    key: 'zapier',
    title: 'เชื่อมต่อผ่าน Zapier',
    hyperlinkText: 'ดู Zaps ทั้งหมด',
    hyperlink: 'https://zapier.com/apps',
    integrations: [
      {
        from: {
          key: 'mobius',
          image: '/images/icons/android/android-launchericon-192-192.png',
        },
        to: { key: 'slack', image: '/images/integrations/slack-logo.png' },
        type: 'Use',
        text: 'โพสต์ไปยัง Slack เมื่อข้อมูลบริษัทถูกอัปเดต',
        link: 'https://zapier.com/apps/slack/integrations',
      },
      {
        from: { key: 'cal', image: '/images/integrations/cal-logo.png' },
        to: {
          key: 'mobius',
          image: '/images/icons/android/android-launchericon-192-192.png',
        },
        type: 'Use',
        text: 'สร้างบุคคลเมื่อมีการสร้างอีเวนต์ใน Cal.com',
        link: 'https://zapier.com/apps/calcom/integrations',
      },
      {
        from: {
          key: 'mailchimp',
          image: '/images/integrations/mailchimp-logo.png',
        },
        to: {
          key: 'mobius',
          image: '/images/icons/android/android-launchericon-192-192.png',
        },
        type: 'Use',
        text: 'สร้างบุคคลเมื่อมีการสมัครสมาชิกใหม่ใน Mailchimp',
        link: 'https://zapier.com/apps/mailchimp/integrations',
      },
      {
        from: { key: 'tally', image: '/images/integrations/tally-logo.png' },
        to: {
          key: 'mobius',
          image: '/images/icons/android/android-launchericon-192-192.png',
        },
        type: 'Use',
        text: 'สร้างบริษัทเมื่อส่งฟอร์มจาก Tally',
        link: 'https://zapier.com/apps/tally/integrations',
      },
    ],
  };
