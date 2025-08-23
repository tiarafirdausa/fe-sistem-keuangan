// src/components/shared/Logo.jsx
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { apiGetSettings } from '@/services/SettingService';
import appConfig from '@/configs/app.config';

const Logo = (props) => {
    const {
        className,
        imgClass,
        style,
        logoWidth = 'auto',
    } = props;

    const [logoSrc, setLogoSrc] = useState(null);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const settings = await apiGetSettings();
                if (settings && settings.appearance && settings.appearance.logo) {
                    const fullLogoPath = `${appConfig.backendBaseUrl}${settings.appearance.logo}`;
                    setLogoSrc(fullLogoPath);
                }
            } catch (error) {
                console.error("Failed to fetch settings for logo:", error);
            }
        };

        fetchLogo();
    }, []);

    return (
        <div
            className={classNames('logo', className)}
            style={{
                ...style,
                ...{ width: logoWidth },
            }}
        >
            <img
                className={imgClass}
                src={logoSrc}
                alt="Site logo"
            />
        </div>
    );
};

export default Logo;