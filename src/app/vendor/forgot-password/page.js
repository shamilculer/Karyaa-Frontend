import ForgotPasswordForm from '@/app/auth/components/forms/ForgotPasswordForm';
import Link from 'next/link';

export const metadata = {
    title: 'Vendor Forgot Password - Karyaa',
    description: 'Reset your vendor account password.',
};

export default function VendorForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                        Vendor Password Reset
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your registered vendor email to receive a reset link.
                    </p>
                </div>

                <ForgotPasswordForm type="vendor" />

                <div className="text-center mt-4">
                    <Link href="/vendor/login" className="font-medium text-blue-600 hover:text-blue-500 text-sm">
                        Back to Vendor Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
