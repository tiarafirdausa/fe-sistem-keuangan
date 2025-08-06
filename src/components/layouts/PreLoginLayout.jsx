// src/views/layout/PreLoginLayout.jsx
import authRoute from '@/configs/routes.config/authRoute'
import { useLocation } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import PublicLayout from './PublicLayout'

const PreLoginLayout = ({children}) => {
    const location = useLocation()
    const { pathname } = location

    const isAuthPath = authRoute.some((route) => route.path === pathname)

    return (
        <div className="flex flex-auto flex-col h-[100vh]">
             {isAuthPath ? (
                <AuthLayout>
                    {children}
                </AuthLayout>
            ) : (
                <PublicLayout>
                    {children}
                </PublicLayout>
            )}
        </div>
    )
}

export default PreLoginLayout
