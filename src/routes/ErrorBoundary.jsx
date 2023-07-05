import React, { ReactElement } from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    console.log("E: ", error);
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <p>Loading failed! Please reload.</p>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
