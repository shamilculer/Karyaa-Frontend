"use client";

import { Component } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default class VendorErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, err: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, err: error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full flex flex-col items-center justify-center p-10 min-h-[400px] text-center bg-red-50 rounded-lg border">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-red-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600 mb-6">
            We couldn’t load vendor listings. Try again later.
          </p>
          <Button onClick={() => location.reload()} variant="destructive">
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
