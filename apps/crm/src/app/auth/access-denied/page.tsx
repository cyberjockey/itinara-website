import Link from 'next/link';

export default function AccessDeniedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full text-center px-6">
                <div className="mb-8">
                    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h1>
                    <p className="text-gray-600 mb-8">
                        You don&apos;t have permission to access the CRM. This area is restricted to administrators and local guides.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="https://itinara.com"
                        className="block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Itinara Website
                    </Link>
                    <Link
                        href="/auth/login"
                        className="block w-full px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Sign in with Different Account
                    </Link>
                </div>

                <p className="mt-8 text-sm text-gray-500">
                    If you believe this is an error, please contact an administrator.
                </p>
            </div>
        </div>
    );
}
