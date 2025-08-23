// src/utils/HeadUpdater.jsx
import { useEffect } from 'react';
import { apiGetSettings } from '@/services/SettingService';

const HeadUpdater = () => {
  useEffect(() => {
    const updateHead = async () => {
      try {
        const settings = await apiGetSettings();
        const faviconLink = document.querySelector('link[rel="shortcut icon"]');
        if (faviconLink && settings.appearance && settings.appearance.logo) {
          faviconLink.href = settings.appearance.logo;
        }
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && settings.seo && settings.seo.meta_description) {
          metaDescription.content = settings.seo.meta_description;
        }
        if (settings.general && settings.general.site_title) {
            document.title = `Dashboard | ${settings.general.site_title}`;
        }

      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    updateHead();
  }, []);

  return null;
};

export default HeadUpdater;