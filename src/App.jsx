import { BrowserRouter } from 'react-router'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import appConfig from './configs/app.config'
import { useEffect } from 'react';
import { fetchCsrfToken } from './services/axios/csrfService'
import '@fortawesome/fontawesome-free/css/all.min.css';

if (appConfig.enableMock) {
    import('./mock')
}

function App() {
    useEffect(() => {
        fetchCsrfToken();
    }, []);
    return (
        <Theme>
            <BrowserRouter>
                <AuthProvider>
                    <Layout>
                        <Views />
                    </Layout>
                </AuthProvider>
            </BrowserRouter>
        </Theme>
    )
}

export default App
