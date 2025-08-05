import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import ThemeSettingsListContent from './components/ThemeSettingsListContent'

const ThemeSettingsList = () => {
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>Appearance Settings</h3>
                    </div>
                    <ThemeSettingsListContent />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default ThemeSettingsList