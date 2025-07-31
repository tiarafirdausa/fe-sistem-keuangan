import { useSessionUser } from '@/store/authStore'

const unauthorizedCode = [401, 419, 440]

const AxiosResponseIntrceptorErrorCallback = (error) => {
    const { response } = error

    if (response && unauthorizedCode.includes(response.status)) {
        useSessionUser.getState().setUser({})
        useSessionUser.getState().setSessionSignedIn(false)
    }
    return Promise.reject(error);
}

export default AxiosResponseIntrceptorErrorCallback
