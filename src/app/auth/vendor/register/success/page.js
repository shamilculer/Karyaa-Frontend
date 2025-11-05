import { Button } from "@/components/ui/button";
import { Clock, Mail, Home } from "lucide-react";
import Link from "next/link";
// Note: Assuming lucide-react icons are available in your project.

const RegistrationSuccessful = () => {
  
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50 bg-[url('/new-banner-6.jpg')] bg-cover bg-center relative">
      
      {/* Background Overlay for better readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      {/* ⭐️ UPDATED MIDDLE CONTAINER UI ⭐️ */}
      <div className="w-11/12 max-w-2xl p-8 sm:p-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border-t-4 border-b-4 border-secondary text-center  z-10">
        
        {/* Icon (Clock/Review State) - Animated and prominent */}
        <div className="mx-auto w-fit p-4 mb-8 bg-yellow-50 rounded-full border-4 border-yellow-300 shadow-inner">
          <Clock className="w-14 h-14 text-yellow-600 animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="!text-2xl sm:!text-3xl mb-2">
          Registration Successful 🎉
        </h1>

        {/* Core Message */}
        <p className="text-gray-600 mb-8 !text-sm">
          Thank you for completing your vendor registration. Your application is now officially Under Review by our dedicated team.
        </p>

        {/* --- Next Step Section (Highlight Box) --- */}
        <div className={`p-6 px-10 bg-secondary/20 rounded-xl`}>
            
            <div className="flex items-center justify-center space-x-3 text-green-700">
                <Mail className="w-6 h-6" />
                <h3 className="!text-xl font-extrabold">
                    Next Step: Approval Notification
                </h3>
            </div>
            
            <p className="text-md text-gray-700 mt-4 !text-sm">
                We are currently verifying your business details and Trade License. Please watch your registered email inbox for a detailed approval confirmation once your profile is fully verified and live.
            </p>
            <p className="!text-xs text-green-600 mt-3">
                🕒 This process typically takes 24 business hours.
            </p>
        </div>

        {/* Call to Action */}
        <Button asChild className="mt-10">
          <Link
            href="/"
          >
            <Home className="w-5 h-5 mr-3" />
            Return to Homepage
          </Link>
        </Button>
        
      </div>

    </main>
  )
}

export default RegistrationSuccessful;