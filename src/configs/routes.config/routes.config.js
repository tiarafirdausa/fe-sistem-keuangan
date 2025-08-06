import authRoute from './authRoute'
import dashboardRoute from './dashboardRoute'
import contentManagementRoute from './contentManagementRoute'
import appearanceRoute from './appearanceRoute'
import userRoute from './userRoute'
import PublicPageRoute from './PublicPageRoute'

export const publicRoutes = [
    ...PublicPageRoute,
    ...authRoute
]

export const protectedRoutes = [
    ...dashboardRoute,
    ...contentManagementRoute,
    ...appearanceRoute,
    ...userRoute
]
