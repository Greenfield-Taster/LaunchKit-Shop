import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import "./ErrorBoundary.scss";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = window.location.pathname.includes("/mattress-shop")
      ? "/mattress-shop/"
      : "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__icon">
            <AlertTriangle size={48} />
          </div>
          <h2 className="error-boundary__title">Щось пішло не так</h2>
          <p className="error-boundary__text">
            На сторінці сталася непередбачена помилка.
            <br />
            Спробуйте перезавантажити сторінку або поверніться на головну.
          </p>
          <div className="error-boundary__actions">
            <button
              className="error-boundary__btn error-boundary__btn--primary"
              onClick={this.handleReload}
            >
              <RefreshCw size={18} />
              <span>Перезавантажити</span>
            </button>
            <button
              className="error-boundary__btn error-boundary__btn--outline"
              onClick={this.handleGoHome}
            >
              <Home size={18} />
              <span>На головну</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
