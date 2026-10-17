import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    if (this.props.onReset) {
      this.props.onReset();
      this.setState({ hasError: false, error: null });
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 m-2 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{this.props.fallbackTitle || 'เกิดข้อผิดพลาดในการแสดงผล'}</span>
          </div>
          <p className="text-slate-600">
            {this.state.error?.message || 'ระบบพบข้อผิดพลาดที่ไม่คาดคิด'}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ลองใหม่อีกครั้ง</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
