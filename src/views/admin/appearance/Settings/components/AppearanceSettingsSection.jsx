import { FormItem } from '@/components/ui/Form'
import { Select } from '@/components/ui'
import AdaptiveCard from '@/components/shared/AdaptiveCard'

// Pilihan untuk dropdown Theme Mode (tetap sama)
const themeModes = [
    { value: 'theme1', label: 'Theme 1' },
    { value: 'theme2', label: 'Theme 2' },
    { value: 'theme3', label: 'Theme 3' },
    { value: 'theme4', label: 'Theme 4' },
    { value: 'theme5', label: 'Theme 5' },
]

// Pilihan untuk dropdown Theme Color (tetap sama)
const themeColors = [
    { value: 'amber', label: 'Amber' }, { value: 'blue', label: 'Blue' },
    { value: 'blue-grey', label: 'Blue Grey' }, { value: 'brown', label: 'Brown' },
    { value: 'cyan', label: 'Cyan' }, { value: 'green', label: 'Green' },
    { value: 'deep-orange', label: 'Deep Orange' }, { value: 'deep-purple', label: 'Deep Purple' },
    { value: 'grey', label: 'Grey' }, { value: 'indigo', label: 'Indigo' },
    { value: 'light-blue', label: 'Light Blue' }, { value: 'light-green', label: 'Light Green' },
    { value: 'lime', label: 'Lime' }, { value: 'orange', label: 'Orange' },
    { value: 'pink', label: 'Pink' }, { value: 'purple', label: 'Purple' },
    { value: 'red', label: 'Red' }, { value: 'teal', label: 'Teal' },
    { value: 'yellow', label: 'Yellow' }
]


const colorMap = {
    amber: 'bg-amber-500', blue: 'bg-blue-500', 'blue-grey': 'bg-slate-500',
    brown: 'bg-brown-500', cyan: 'bg-cyan-500', green: 'bg-green-500',
    'deep-orange': 'bg-orange-700', 'deep-purple': 'bg-purple-700',
    grey: 'bg-gray-500', indigo: 'bg-indigo-500', 'light-blue': 'bg-sky-500',
    'light-green': 'bg-lime-500', lime: 'bg-lime-400', orange: 'bg-orange-500',
    pink: 'bg-pink-500', purple: 'bg-purple-500', red: 'bg-red-500',
    teal: 'bg-teal-500', yellow: 'bg-yellow-500'
};


const formatOptionLabel = ({ value, label }) => (
    <div className="flex items-center">
        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${colorMap[value]}`}></span>
        <span>{label}</span>
    </div>
);

const AppearanceSettingsSection = ({ formData, handleChange, errors }) => {
    const handleSelectChange = (name, selectedOption) => {
        handleChange({ target: { name, value: selectedOption ? selectedOption.value : '' } })
    }

    return (
        <AdaptiveCard className="mb-4" bodyClass="p-6" title="Appearance Settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem label="Theme Mode" invalid={!!errors.theme_mode} errorMessage={errors.theme_mode}>
                    <Select
                        name="theme_mode"
                        placeholder="Select Theme Mode"
                        options={themeModes}
                        value={themeModes.find(option => option.value === formData.theme_mode)}
                        onChange={(selected) => handleSelectChange('theme_mode', selected)}
                    />
                </FormItem>
                <FormItem label="Theme Color" invalid={!!errors.theme_color} errorMessage={errors.theme_color}>
                    <Select
                        name="theme_color"
                        placeholder="Select Theme Color"
                        options={themeColors}
                        value={themeColors.find(option => option.value === formData.theme_color)}
                        formatOptionLabel={formatOptionLabel}
                        onChange={(selected) => handleSelectChange('theme_color', selected)}
                    />
                </FormItem>
            </div>
        </AdaptiveCard>
    )
}

export default AppearanceSettingsSection