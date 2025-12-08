import ForgotPasswordForm from '@/app/auth/components/forms/ForgotPasswordForm';
import Link from 'next/link';

export const metadata = {
    title: 'Forgot Password - Karyaa',
    description: 'Reset your password to access your account.',
};

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                        Forgot Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <ForgotPasswordForm type="user" />

                <div className="text-center mt-4">
                    <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 text-sm">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
