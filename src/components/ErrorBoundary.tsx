import { Component } from "react"
import { Link } from "react-router-dom"

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Something went wrong</h2>
            <p className="text-neutral-500 mb-6">An unexpected error occurred.</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors text-sm font-medium"
              onClick={() => this.setState({ hasError: false })}
            >
              Back to Home
            </Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
