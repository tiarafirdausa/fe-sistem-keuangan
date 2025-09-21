import { useRef, useImperativeHandle, useState, useEffect, useCallback } from 'react'
import AuthContext from './AuthContext'
import appConfig from '@/configs/app.config'
import { useSessionUser } from '@/store/authStore'
import { apiSignIn, apiSignOut, apiGetMe, apiRefreshToken } from '@/services/AuthService'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'

const IsolatedNavigator = ({ ref }) => {
    const navigate = useNavigate()
    useImperativeHandle(ref, () => ({ navigate }), [navigate])
    return <></>
}

const convertExpiresInToMs = (expiresIn) => {
    const value = parseInt(expiresIn);
    if (expiresIn.endsWith("h")) return value * 60 * 60 * 1000;
    if (expiresIn.endsWith("m")) return value * 60 * 1000;
    if (expiresIn.endsWith("d")) return value * 24 * 60 * 60 * 1000;
    return value * 1000;
};

const JWT_EXPIRES_IN = '1h'; 
const REFRESH_INTERVAL_MS = convertExpiresInToMs(JWT_EXPIRES_IN) * 0.5;

function AuthProvider({ children }) {
    const setUser = useSessionUser((state) => state.setUser)
    const setSessionSignedIn = useSessionUser((state) => state.setSessionSignedIn)
    const userZustand = useSessionUser((state) => state.user)

    const [authenticated, setAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);

    const navigatorRef = useRef(null)
    const refreshTimer = useRef(null);

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

    const startRefreshTokenTimer = useCallback(() => {
        if (refreshTimer.current) {
            clearTimeout(refreshTimer.current);
        }

        refreshTimer.current = setTimeout(async () => {
            try {
                await apiRefreshToken();
                console.log("Token berhasil diperbarui secara otomatis.");
                startRefreshTokenTimer();
            } catch (error) {
                console.error("Gagal memperbarui token. Sesi berakhir.", error.response?.data?.error || error.message);
                handleSignOut();
            }
        }, REFRESH_INTERVAL_MS);
    }, [handleSignOut]);

    const handleActivity = useCallback(() => {
        if (authenticated) {
            startRefreshTokenTimer();
        }
    }, [authenticated, startRefreshTokenTimer]);
    
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
                console.error("Gagal memverifikasi status login:", error.response?.data?.error || error.message);
                handleSignOut();
            } finally {
                setLoadingAuth(false);
            }
        };
        verifyAuthStatus();
    }, [handleSignIn, handleSignOut]);

    useEffect(() => {
        if (authenticated) {
            startRefreshTokenTimer();
            const eventListeners = ['mousemove', 'keydown', 'click', 'scroll'];
            eventListeners.forEach(event => {
                window.addEventListener(event, handleActivity);
            });

            return () => {
                eventListeners.forEach(event => {
                    window.removeEventListener(event, handleActivity);
                });
                if (refreshTimer.current) {
                    clearTimeout(refreshTimer.current);
                }
            };
        }
    }, [authenticated, handleActivity, startRefreshTokenTimer]);

    const signIn = async (values) => {
        try {
            const resp = await apiSignIn(values) 
            if (resp && resp.user) {
                handleSignIn(resp.user)
                redirect()
                return { status: 'success', message: '' }
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
            await apiSignOut() 
        } finally {
            handleSignOut() 
            navigatorRef.current?.navigate('/', { replace: true })
        }
    }

    if (loadingAuth) {
        return (
            null
        );
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                user: userZustand,
                signIn,
                signOut,
            }}
        >
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    )
}

export default AuthProvider;