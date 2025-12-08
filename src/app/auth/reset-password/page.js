import ResetPasswordForm from '@/app/auth/components/forms/ResetPasswordForm';
import Link from 'next/link';

export const metadata = {
    title: 'Reset Password - Karyaa',
    description: 'Create a new password for your account.',
};

import { Suspense } from 'react'; // Added import

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please enter your new password below.
                    </p>
                </div>

                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordForm type="user" />
                </Suspense>

            </div>
        </div>
    );
}
