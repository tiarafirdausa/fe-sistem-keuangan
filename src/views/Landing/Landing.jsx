// src/views/LandingPage.jsx
import { Link } from 'react-router-dom' // Assuming you use react-router-dom for navigation

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Welcome to Our Application
            </h1>
            <p className="text-lg mb-8 text-center max-w-2xl">
                This is your new landing page. You can add more content,
                images, and features here to introduce your application
                to users before they log in.
            </p>
            <div className="space-x-4">
                <Link
                    to="/sign-in" // Link to your sign-in page
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                    Login
                </Link>
            </div>
            <footer className="mt-12 text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Your Company Name. All rights reserved.
            </footer>
        </div>
    )
}

export default Landing
