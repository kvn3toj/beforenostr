import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ErrorMessage } from './ErrorMessage';

// Mock MUI components
vi.mock('@mui/material', () => ({
  Alert: vi.fn(({ children, severity, variant, sx, action }) => (
    <div 
      data-testid="alert"
      data-severity={severity}
      data-variant={variant}
      style={sx}
    >
      {children}
      {action && <div data-testid="alert-action">{action}</div>}
    </div>
  )),
  AlertTitle: vi.fn(({ children }) => (
    <div data-testid="alert-title">{children}</div>
  )),
  Box: vi.fn(({ children, ...props }) => (
    <div data-testid="box" {...props}>{children}</div>
  )),
  Button: vi.fn(({ children, color, size, onClick, startIcon, ...props }) => (
    <button 
      data-testid="retry-button"
      data-color={color}
      data-size={size}
      onClick={onClick}
      {...props}
    >
      {startIcon && <span data-testid="button-icon">{startIcon}</span>}
      {children}
    </button>
  )),
  Typography: vi.fn(({ children, component, variant, ...props }) => (
    <div 
      data-testid={`typography-${variant || 'default'}`}
      data-component={component}
      {...props}
    >
      {children}
    </div>
  )),
}));

// Mock MUI icons
vi.mock('@mui/icons-material/Refresh', () => ({
  default: vi.fn(() => <span data-testid="refresh-icon">🔄</span>),
}));

describe('ErrorMessage', () => {
  const defaultProps = {
    message: 'Test error message',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render basic error message', () => {
    render(<ErrorMessage {...defaultProps} />);

    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should render with default severity', () => {
    render(<ErrorMessage {...defaultProps} />);

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveAttribute('data-severity', 'error');
  });

  it('should render with custom severity', () => {
    render(<ErrorMessage {...defaultProps} severity="warning" />);

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveAttribute('data-severity', 'warning');
  });

  it('should render with info severity', () => {
    render(<ErrorMessage {...defaultProps} severity="info" />);

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveAttribute('data-severity', 'info');
  });

  it('should render with default variant', () => {
    render(<ErrorMessage {...defaultProps} />);

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveAttribute('data-variant', 'standard');
  });

  it('should render with custom variant', () => {
    render(<ErrorMessage {...defaultProps} variant="filled" />);

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveAttribute('data-variant', 'filled');
  });

  it('should render with outlined variant', () => {
    render(<ErrorMessage {...defaultProps} variant="outlined" />);

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveAttribute('data-variant', 'outlined');
  });

  it('should render title when provided', () => {
    const title = 'Error Title';
    render(<ErrorMessage {...defaultProps} title={title} />);

    expect(screen.getByTestId('alert-title')).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('should not render title when not provided', () => {
    render(<ErrorMessage {...defaultProps} />);

    expect(screen.queryByTestId('alert-title')).not.toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage {...defaultProps} onRetry={onRetry} />);

    expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    expect(screen.getByText('Reintentar')).toBeInTheDocument();
    expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage {...defaultProps} />);

    expect(screen.queryByTestId('retry-button')).not.toBeInTheDocument();
  });

  it('should not render retry button when showRetry is false', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage {...defaultProps} onRetry={onRetry} showRetry={false} />);

    expect(screen.queryByTestId('retry-button')).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorMessage {...defaultProps} onRetry={onRetry} />);

    await user.click(screen.getByTestId('retry-button'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should render custom retry label', () => {
    const onRetry = vi.fn();
    const customLabel = 'Try Again';
    render(<ErrorMessage {...defaultProps} onRetry={onRetry} retryLabel={customLabel} />);

    expect(screen.getByText(customLabel)).toBeInTheDocument();
    expect(screen.queryByText('Reintentar')).not.toBeInTheDocument();
  });

  it('should apply correct button properties', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage {...defaultProps} onRetry={onRetry} />);

    const button = screen.getByTestId('retry-button');
    expect(button).toHaveAttribute('data-color', 'inherit');
    expect(button).toHaveAttribute('data-size', 'small');
  });

  it('should apply correct typography properties', () => {
    render(<ErrorMessage {...defaultProps} />);

    const typography = screen.getByTestId('typography-body2');
    expect(typography).toHaveAttribute('data-component', 'div');
    expect(typography).toHaveTextContent('Test error message');
  });

  it('should render with all props combined', () => {
    const onRetry = vi.fn();
    render(
      <ErrorMessage
        title="Complete Error"
        message="Complete error message"
        severity="warning"
        onRetry={onRetry}
        retryLabel="Custom Retry"
        showRetry={true}
        variant="filled"
      />
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveAttribute('data-severity', 'warning');
    expect(alert).toHaveAttribute('data-variant', 'filled');
    
    expect(screen.getByText('Complete Error')).toBeInTheDocument();
    expect(screen.getByText('Complete error message')).toBeInTheDocument();
    expect(screen.getByText('Custom Retry')).toBeInTheDocument();
  });

  it('should handle empty message', () => {
    render(<ErrorMessage message="" />);

    const typography = screen.getByTestId('typography-body2');
    expect(typography).toHaveTextContent('');
  });

  it('should handle long message', () => {
    const longMessage = 'This is a very long error message that should be displayed properly in the error component without any issues';
    render(<ErrorMessage message={longMessage} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('should handle special characters in message', () => {
    const specialMessage = 'Error: <script>alert("test")</script> & special chars';
    render(<ErrorMessage message={specialMessage} />);

    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });

  it('should render alert action when retry button is present', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage {...defaultProps} onRetry={onRetry} />);

    expect(screen.getByTestId('alert-action')).toBeInTheDocument();
  });

  it('should not render alert action when no retry button', () => {
    render(<ErrorMessage {...defaultProps} />);

    expect(screen.queryByTestId('alert-action')).not.toBeInTheDocument();
  });
}); 