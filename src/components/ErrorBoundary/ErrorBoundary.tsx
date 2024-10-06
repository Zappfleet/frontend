import { Component, ReactNode } from 'react';
import Page404 from '../../components/Page404/Page404';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: any; errorInfo: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    // به‌روزرسانی state برای نمایش صفحه جایگزین در صورت بروز خطا
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // ثبت خطا در state و لاگ در کنسول برای توسعه‌دهندگان
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // نمایش صفحه 404 به همراه جزئیات خطا در محیط توسعه
      return (
        <div>
          <Page404 />
          {import.meta.env.VITE_MODE === 'development' && (
            <div className="error-details">
              <h2>An error occurred:</h2>
              <p>{this.state.error?.toString()}</p>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </div>
          )}
        </div>
      );
    }

    // نمایش کودکان اگر خطایی نباشد
    return this.props.children;
  }
}

export default ErrorBoundary;
