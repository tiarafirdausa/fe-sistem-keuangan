import { lazy } from 'react'

const authRoute = [
    {
        key: 'signIn',
        path: `/login`,
        component: lazy(() => import('@/views/auth/SignIn')),
        authority: [],
    },
    {
        key: 'forgotPassword',
        path: `/forgot-password`,
        component: lazy(() => import('@/views/auth/ForgotPassword')),
        authority: [],
    },
    {
        key: 'resetPassword',
        path: `/reset-password`,
        component: lazy(() => import('@/views/auth/ResetPassword')),
        authority: [],
    },
]

export default authRoute
