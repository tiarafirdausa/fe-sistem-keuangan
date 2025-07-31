import { create } from 'zustand'

const initialState = {
    session: {
        signedIn: false,
    },
    user: {
        email: '',
        authority: [],
        id: undefined,
        name: '',
        role: '',
        foto: '',
        status: '',
    },
}

export const useSessionUser = create()((set) => ({
    ...initialState,
    setSessionSignedIn: (payload) =>
        set((state) => ({
            session: {
                ...state.session,
                signedIn: payload,
            },
        })),
    setUser: (payload) =>
        set((state) => ({
            user: {
                ...state.user,
                ...payload,
                authority: Array.isArray(payload.role) ? payload.role : (payload.role ? [payload.role] : []),
            },
        })),
}));

