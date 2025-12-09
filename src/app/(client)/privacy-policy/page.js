import React from "react";
import { getContentByKeyAction } from "@/app/actions/public/content";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy",
  description: "Our privacy policy and data protection practices",
};

const PrivacyPolicyPage = async () => {
  const result = await getContentByKeyAction("privacy-policy");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated:
            {result.success && result.data?.updatedAt
              ? new Date(result.data.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
              : "N/A"}
          </p>
        </div>

        <Card className="p-3 xl:p-8 bg-white shadow-sm">
          {result.success && result.data?.content ? (
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-gray-900 
                prose-h1:!text-5xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-6
                prose-h2:!text-4xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4
                prose-h3:!text-3xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-4 prose-p:min-h-[1.5em]
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:[list-style-position:outside]
                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:[list-style-position:outside]
                prose-li:text-gray-700 prose-li:my-2
                prose-blockquote:border-l-4 prose-blockquote:border-gray-300 
                prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:my-4
                prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 
                prose-code:rounded prose-code:text-sm prose-code:text-gray-800
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 
                prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-4
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-4
                prose-hr:my-8 prose-hr:border-gray-300"
              dangerouslySetInnerHTML={{ __html: result.data.content }}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Privacy policy content is not available at the moment.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Please check back later or contact support.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;