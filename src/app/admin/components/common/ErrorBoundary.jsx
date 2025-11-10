"use client";
import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return React.cloneElement(this.props.fallback, {
        message: this.state.errorMessage,
      });
    }
    return this.props.children;
  }
}
