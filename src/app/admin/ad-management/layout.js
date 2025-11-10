import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function AdManagementLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-[50vh] flex-col">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-600">Loading ad management...</p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
