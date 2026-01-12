import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ 
      hasError: true, 
      error: error, 
      errorInfo: errorInfo 
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-red-600 mb-4">發生錯誤</h1>
            <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
              <p className="font-semibold text-red-800">錯誤訊息：</p>
              <p className="text-red-700 mt-2">
                {this.state.error ? this.state.error.toString() : '未知錯誤'}
              </p>
              {this.state.error?.message && (
                <p className="text-red-600 mt-1 text-sm">
                  詳細: {this.state.error.message}
                </p>
              )}
              {this.state.error?.stack && (
                <pre className="text-xs mt-2 overflow-auto bg-red-100 p-2 rounded">
                  {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                </pre>
              )}
            </div>
            {this.state.errorInfo && (
              <details className="bg-gray-50 p-4 rounded">
                <summary className="cursor-pointer font-semibold">錯誤堆疊</summary>
                <pre className="text-xs mt-2 overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              重新載入頁面
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
