import { Component, type ErrorInfo, type ReactNode } from "react";

// Локальный «try/catch» для React-рендера: если дочернее поддерево падает (например,
// эмбед карты), мы не роняем всю страницу, а показываем fallback (или ничего).
type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Не валим страницу — просто логируем.
    console.error("[design06] ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
