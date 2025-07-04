import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LoadingSpinner } from './LoadingSpinner';

// Mock MUI components
vi.mock('@mui/material', () => ({
  Box: vi.fn(({ children, display, flexDirection, justifyContent, alignItems, minHeight, gap, ...props }) => (
    <div 
      data-testid="loading-box"
      data-display={display}
      data-flex-direction={flexDirection}
      data-justify-content={justifyContent}
      data-align-items={alignItems}
      data-min-height={minHeight}
      data-gap={gap}
      {...props}
    >
      {children}
    </div>
  )),
  CircularProgress: vi.fn(({ size }) => (
    <div data-testid="circular-progress" data-size={size}>Loading...</div>
  )),
  Typography: vi.fn(({ children, variant, color, textAlign, ...props }) => (
    <div 
      data-testid={`typography-${variant || 'default'}`}
      data-color={color}
      data-text-align={textAlign}
      {...props}
    >
      {children}
    </div>
  )),
}));

describe('LoadingSpinner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default props', () => {
    render(<LoadingSpinner />);

    expect(screen.getByTestId('loading-box')).toBeInTheDocument();
    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    const customMessage = 'Procesando datos...';
    render(<LoadingSpinner message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
  });

  it('should render without message when message is empty', () => {
    render(<LoadingSpinner message="" />);

    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
    expect(screen.queryByTestId('typography-body2')).not.toBeInTheDocument();
  });

  it('should render with custom size', () => {
    render(<LoadingSpinner size={60} />);

    const circularProgress = screen.getByTestId('circular-progress');
    expect(circularProgress).toHaveAttribute('data-size', '60');
  });

  it('should render with string size', () => {
    render(<LoadingSpinner size="large" />);

    const circularProgress = screen.getByTestId('circular-progress');
    expect(circularProgress).toHaveAttribute('data-size', 'large');
  });

  it('should render with custom minHeight', () => {
    render(<LoadingSpinner minHeight="300px" />);

    const loadingBox = screen.getByTestId('loading-box');
    expect(loadingBox).toHaveAttribute('data-min-height', '300px');
  });

  it('should render with numeric minHeight', () => {
    render(<LoadingSpinner minHeight={400} />);

    const loadingBox = screen.getByTestId('loading-box');
    expect(loadingBox).toHaveAttribute('data-min-height', '400');
  });

  it('should render centered variant by default', () => {
    render(<LoadingSpinner />);

    const loadingBox = screen.getByTestId('loading-box');
    expect(loadingBox).toHaveAttribute('data-display', 'flex');
    expect(loadingBox).toHaveAttribute('data-flex-direction', 'column');
    expect(loadingBox).toHaveAttribute('data-justify-content', 'center');
    expect(loadingBox).toHaveAttribute('data-align-items', 'center');
  });

  it('should render centered variant explicitly', () => {
    render(<LoadingSpinner variant="centered" />);

    const loadingBox = screen.getByTestId('loading-box');
    expect(loadingBox).toHaveAttribute('data-display', 'flex');
    expect(loadingBox).toHaveAttribute('data-flex-direction', 'column');
    expect(loadingBox).toHaveAttribute('data-justify-content', 'center');
    expect(loadingBox).toHaveAttribute('data-align-items', 'center');
  });

  it('should render default variant', () => {
    render(<LoadingSpinner variant="default" />);

    const loadingBox = screen.getByTestId('loading-box');
    expect(loadingBox).toHaveAttribute('data-display', 'flex');
    expect(loadingBox).toHaveAttribute('data-flex-direction', 'column');
  });

  it('should render inline variant', () => {
    render(<LoadingSpinner variant="inline" />);

    const loadingBox = screen.getByTestId('loading-box');
    expect(loadingBox).toHaveAttribute('data-display', 'inline-flex');
    expect(loadingBox).toHaveAttribute('data-align-items', 'center');
    expect(loadingBox).toHaveAttribute('data-gap', '1');
  });

  it('should render inline variant without message', () => {
    render(<LoadingSpinner variant="inline" message="" />);

    const loadingBox = screen.getByTestId('loading-box');
    expect(loadingBox).toHaveAttribute('data-display', 'inline-flex');
    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
    expect(screen.queryByTestId('typography-body2')).not.toBeInTheDocument();
  });

  it('should apply correct typography styles for centered variant', () => {
    render(<LoadingSpinner message="Test message" />);

    const typography = screen.getByTestId('typography-body2');
    expect(typography).toHaveAttribute('data-color', 'text.secondary');
    expect(typography).toHaveAttribute('data-text-align', 'center');
    expect(typography).toHaveTextContent('Test message');
  });

  it('should apply correct typography styles for inline variant', () => {
    render(<LoadingSpinner variant="inline" message="Inline message" />);

    const typography = screen.getByTestId('typography-body2');
    expect(typography).toHaveAttribute('data-color', 'text.secondary');
    expect(typography).not.toHaveAttribute('data-text-align');
    expect(typography).toHaveTextContent('Inline message');
  });

  it('should handle all props together', () => {
    render(
      <LoadingSpinner
        message="Complete test"
        size={50}
        minHeight="250px"
        variant="centered"
      />
    );

    const loadingBox = screen.getByTestId('loading-box');
    const circularProgress = screen.getByTestId('circular-progress');
    const typography = screen.getByTestId('typography-body2');

    expect(loadingBox).toHaveAttribute('data-min-height', '250px');
    expect(circularProgress).toHaveAttribute('data-size', '50');
    expect(typography).toHaveTextContent('Complete test');
  });

  it('should handle undefined message', () => {
    render(<LoadingSpinner message={undefined} />);

    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
    // When message is undefined, it defaults to 'Cargando...'
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('should render with zero size', () => {
    render(<LoadingSpinner size={0} />);

    const circularProgress = screen.getByTestId('circular-progress');
    expect(circularProgress).toHaveAttribute('data-size', '0');
  });
}); 