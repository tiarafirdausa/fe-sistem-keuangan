// src/auth/AuthProvider.jsx (Versi revisi final dari diskusi kita)
import { useRef, useImperativeHandle, useState, useEffect, useCallback } from 'react'
import AuthContext from './AuthContext'
import appConfig from '@/configs/app.config'
import { useSessionUser } from '@/store/authStore'
import { apiSignIn, apiSignOut, apiGetMe } from '@/services/AuthService'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'

const IsolatedNavigator = ({ ref }) => {
    const navigate = useNavigate()
    useImperativeHandle(ref, () => ({ navigate }), [navigate])
    return <></>
}

function AuthProvider({ children }) {
    const setUser = useSessionUser((state) => state.setUser)
    const setSessionSignedIn = useSessionUser((state) => state.setSessionSignedIn)
    const userZustand = useSessionUser((state) => state.user)

    const [authenticated, setAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);

    const navigatorRef = useRef(null)

    const redirect = useCallback(() => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        const redirectUrl = params.get(REDIRECT_URL_KEY)

        navigatorRef.current?.navigate(
            redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath,
            { replace: true }
        )
    }, []);

    const handleSignIn = useCallback((userData) => {
        setSessionSignedIn(true);
        setUser(userData);
        setAuthenticated(true);
    }, [setSessionSignedIn, setUser]);

    const handleSignOut = useCallback(() => {
        setSessionSignedIn(false);
        setUser({});
        setAuthenticated(false);
    }, [setSessionSignedIn, setUser]);

    useEffect(() => {
        const verifyAuthStatus = async () => {
            try {
                const resp = await apiGetMe();
                if (resp && resp.user) {
                    handleSignIn(resp.user);
                } else {
                    handleSignOut();
                }
            } catch (error) {
                console.error("Error verifying logged-in user status via /me endpoint:", error.response?.data?.error || error.message);
                handleSignOut();
            } finally {
                setLoadingAuth(false);
            }
        };

        verifyAuthStatus();
    }, [handleSignIn, handleSignOut]);


    const signIn = async (values) => {
        try {
            const resp = await apiSignIn(values) 
            if (resp && resp.user) {
                handleSignIn(resp.user)
                redirect()
                return {
                    status: 'success',
                    message: '',
                }
            }
            return {
                status: 'failed',
                message: resp?.error || 'Unable to sign in',
            }
        } catch (errors) {
            console.error("SignIn API Error:", errors.response?.data?.error || errors.toString());
            return {
                status: 'failed',
                message: errors?.response?.data?.error || errors.toString(),
            }
        }
    }

    const signOut = async () => {
        try {
            await apiSignOut() // Ini memicu backend untuk menghapus HttpOnly cookie
        } finally {
            handleSignOut() // Bersihkan state frontend
            navigatorRef.current?.navigate('/', { replace: true })
        }
    }

    if (loadingAuth) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>
                Memuat status autentikasi...
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                user: userZustand,
                signIn,
                signOut,
                // oAuthSignIn, // Jika ada
            }}
        >
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    )
}

export default AuthProvider;