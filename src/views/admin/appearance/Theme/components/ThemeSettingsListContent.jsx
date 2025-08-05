// src/views/admin/appearance/Settings/components/ThemeSettingsListContent.jsx

import ModeSwitcher from '@/components/template/ThemeConfigurator/ModeSwitcher'
import ThemeSwitcher from '@/components/template/ThemeConfigurator/ThemeSwitcher'
import DirectionSwitcher from '@/components/template/ThemeConfigurator/DirectionSwitcher'
import LayoutSwitcher from '@/components/template/ThemeConfigurator/LayoutSwitcher'

const ThemeSettingsListContent = () => {
    return (
        <div className="flex flex-col gap-y-10 mb-6">
            <div className="flex items-center justify-between">
                <div>
                    <h6>Dark Mode</h6>
                    <span>Switch theme to dark mode</span>
                </div>
                <ModeSwitcher />
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <h6>Direction</h6>
                    <span>Select a direction</span>
                </div>
                <DirectionSwitcher />
            </div>
            <div>
                <h6 className="mb-3">Theme</h6>
                <ThemeSwitcher />
            </div>
            <div>
                <h6 className="mb-3">Layout</h6>
                <LayoutSwitcher />
            </div>
        </div>
    )
}

export default ThemeSettingsListContent