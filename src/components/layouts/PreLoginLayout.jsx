// src/views/layout/PreLoginLayout.jsx
import authRoute from '@/configs/routes.config/authRoute'
import landingPageRoute from '@/configs/routes.config/landingPageRoute' 
import { useLocation } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import { LAYOUT_BLANK } from '@/constants/theme.constant'
import PostLoginLayout from './PostLoginLayout' 

const PreLoginLayout = ({ children }) => {
    const location = useLocation()
    const { pathname } = location

    const isAuthPath = authRoute.some((route) => route.path === pathname)
    const isLandingPageBlankLayout = landingPageRoute.some(
        (route) => route.path === pathname && route.meta?.layout === LAYOUT_BLANK
    )

    return (
        <div className="flex flex-auto flex-col h-[100vh]">
            {isAuthPath ? (
                <AuthLayout>{children}</AuthLayout>
            ) : isLandingPageBlankLayout ? (
                <PostLoginLayout layoutType={LAYOUT_BLANK}>
                    {children}
                </PostLoginLayout>
            ) : (
                children
            )}
        </div>
    )
}

export default PreLoginLayout
