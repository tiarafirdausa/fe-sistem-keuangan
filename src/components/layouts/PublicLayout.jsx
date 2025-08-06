// src/views/layout/PublicLayout.jsx
import Navigation from '@/views/public/Navbar/Navigation'
import useDarkMode from '@/utils/hooks/useDarkMode'
import { MODE_DARK, MODE_LIGHT } from '@/constants/theme.constant'

const PublicLayout = ({children}) => {
    const [isDark, setMode] = useDarkMode()
    const mode = isDark ? MODE_DARK : MODE_LIGHT
    const toggleMode = () => {
        setMode(mode === MODE_LIGHT ? MODE_DARK : MODE_LIGHT)
    }

    return (
        <div className="flex flex-auto flex-col min-h-screen">
            <Navigation toggleMode={toggleMode} mode={mode} />
            <main className="px-4 lg:px-0 text-base pt-[80px]">
                {children}
            </main>
        </div>
    )
}

export default PublicLayout