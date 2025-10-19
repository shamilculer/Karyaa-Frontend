import { Clock, Mail, Home } from "lucide-react";
import Link from "next/link";
// Note: Assuming lucide-react icons are available in your project.
// If you have a custom Button component, you can import and use it here.

const RegistrationSuccessful = () => {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50">
      <div className="w-full max-w-lg p-10 bg-white rounded-2xl shadow-2xl border border-gray-100 text-center transform transition duration-500 hover:shadow-3xl">
        
        {/* Icon (Clock/Review State) */}
        <div className="mx-auto w-fit p-4 mb-6 bg-yellow-100 rounded-full border-4 border-yellow-200 shadow-md">
          <Clock className="w-12 h-12 text-yellow-700 animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Registration Submitted!
        </h1>

        {/* Core Message */}
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Thank you for completing your vendor registration. Your application is now **Under Review** by our dedicated team.
        </p>

        {/* Next Step Section */}
        <div className="p-6 bg-primary/10 rounded-xl border border-primary/20 transition duration-300 hover:shadow-md">
            <div className="flex items-center justify-center space-x-3 text-primary">
                <Mail className="w-6 h-6" />
                <p className="text-xl font-bold">
                    Next Step: Email Confirmation
                </p>
            </div>
            <p className="text-md text-gray-800 mt-4">
                We are currently verifying your business details and Trade License. You will receive a detailed **email confirmation** at your registered address once your profile is **fully approved** and live.
            </p>
            <p className="text-sm text-gray-600 mt-2">
                *This process typically takes 24-48 business hours.*
            </p>
        </div>

        {/* Call to Action */}
        <div className="mt-10">
          <Link
            href="/"
            // Using placeholder styles for a full-width primary button
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-lg font-medium rounded-lg shadow-lg text-white bg-primary hover:bg-primary/90 transition duration-200 ease-in-out transform hover:scale-[1.01]"
          >
            <Home className="w-5 h-5 mr-3" />
            Return to Homepage
          </Link>
        </div>
        
      </div>
    </main>
  )
}

export default RegistrationSuccessful;