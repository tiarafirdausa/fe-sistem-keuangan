// src/views/admin/appearance/Settings/hooks/useSettings.js
import useSWR from 'swr';
import { apiGetSettings } from '@/services/SettingService';

const useSettings = () => {
    const { data, error, isLoading, mutate } = useSWR(
        '/settings',
        apiGetSettings,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        }
    );

    return {
        settings: data,
        isLoading,
        error,
        mutateSettings: mutate,
    };
};

export default useSettings;