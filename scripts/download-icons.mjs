import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://xn--nfloww-vva.com/app/index_files/';

const icons = [
  'hambuger-icon.png',
  'top-globe-icon.png',
  'top-info-icon.png',
  'referral-icon.png',
  'trump-icon.png',
  'alarm-icon.png',
  'min-icon.png',
  'max-icon.png',
  'close-icon.png',
  'of-menu-icon.png',
  'fansly_icon.png',
  'mym_icon.png',
  'fanvu_icon.png',
  'home-icon.svg',
  'of-icon.png',
  'new_post.png',
  'notifications.png',
  'messages_basic_icon.png',
  'vault_icon.png',
  'queue_icon.png',
  'collections_icon.png',
  'statements_icon.png',
  'statistics_icon.png',
  'bank_icon.png',
  'my_profile_icon.png',
  'of_settings_icon.png',
  'analytics-icon.svg',
  'creator-icon.svg',
  'person-icon.svg',
  'fan-icon.svg',
  'message-dashboard-icon.svg',
  'messages-pro-icon.png',
  'messages-pro-right-icon.png',
  'growth-icon.svg',
  'smart_messages_icon.png',
  'smart_lists_icon.png',
  'auto_follow_icon.png',
  'scripts_icon.png',
  'profile_promotion_icon.png',
  'free_trial_links_icon.png',
  'tracking_links_icon.png',
  'sensitive_words_icon.png',
  'ai_copilot_icon.png',
  'share-icon.svg',
  'discover_creators_icon.png',
  'requests_icon.png',
  's4s_schedule_icon.png',
  'settings-icon.png',
  'custom_proxy_icon.png',
  'shift_schedule_icon.png',
  'help-center-icon.png'
];

const targetDir = path.resolve('src/lib/assets');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadFile(filename) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${filename}`;
    const filePath = path.join(targetDir, filename);

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://xn--nfloww-vva.com/app/'
      }
    };

    https.get(url, options, (response) => {
      if (response.statusCode !== 200) {
        resolve(false);
        return;
      }

      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(true);
      });

      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function main() {
  for (const icon of icons) {
    await downloadFile(icon);
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

main();