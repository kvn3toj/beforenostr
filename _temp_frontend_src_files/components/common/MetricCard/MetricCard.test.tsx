import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MetricCard } from './MetricCard';

// Mock MUI components to avoid theme provider issues
vi.mock('@mui/material', () => ({
  Card: vi.fn(({ children, sx }) => (
    <div data-testid="metric-card" style={sx}>{children}</div>
  )),
  CardContent: vi.fn(({ children }) => (
    <div data-testid="card-content">{children}</div>
  )),
  Typography: vi.fn(({ children, variant, color, component, sx, gutterBottom, ...props }) => (
    <div 
      data-testid={`typography-${variant || 'default'}`}
      data-color={color}
      data-component={component}
      style={sx}
      {...props}
    >
      {children}
    </div>
  )),
}));

describe('MetricCard', () => {
  const defaultProps = {
    title: 'Test Metric',
    value: 42,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render basic metric card with title and value', () => {
    render(<MetricCard {...defaultProps} />);

    expect(screen.getByTestId('metric-card')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should render with string value', () => {
    render(<MetricCard {...defaultProps} value="100%" />);

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should render with numeric value', () => {
    render(<MetricCard {...defaultProps} value={1234} />);

    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('should render subtitle when provided', () => {
    const subtitle = 'This is a subtitle';
    render(<MetricCard {...defaultProps} subtitle={subtitle} />);

    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it('should not render subtitle when not provided', () => {
    render(<MetricCard {...defaultProps} />);

    // Check that there's no Typography with caption variant
    const captionElements = screen.queryAllByTestId('typography-caption');
    expect(captionElements).toHaveLength(0);
  });

  it('should render loading state', () => {
    render(<MetricCard {...defaultProps} isLoading={true} />);

    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.queryByText('42')).not.toBeInTheDocument();
  });

  it('should render with default variant', () => {
    render(<MetricCard {...defaultProps} />);

    const valueElement = screen.getByTestId('typography-h4');
    expect(valueElement).toHaveAttribute('data-color', 'text.primary');
  });

  it('should render with primary variant', () => {
    render(<MetricCard {...defaultProps} variant="primary" />);

    const valueElement = screen.getByTestId('typography-h4');
    expect(valueElement).toHaveAttribute('data-color', 'primary.main');
  });

  it('should render with secondary variant', () => {
    render(<MetricCard {...defaultProps} variant="secondary" />);

    const valueElement = screen.getByTestId('typography-h4');
    expect(valueElement).toHaveAttribute('data-color', 'secondary.main');
  });

  it('should have correct typography variants for different elements', () => {
    const subtitle = 'Test subtitle';
    render(<MetricCard {...defaultProps} subtitle={subtitle} />);

    // Title should be h6
    expect(screen.getByTestId('typography-h6')).toBeInTheDocument();
    expect(screen.getByTestId('typography-h6')).toHaveTextContent('Test Metric');

    // Value should be h4
    expect(screen.getByTestId('typography-h4')).toBeInTheDocument();
    expect(screen.getByTestId('typography-h4')).toHaveTextContent('42');

    // Subtitle should be caption
    expect(screen.getByTestId('typography-caption')).toBeInTheDocument();
    expect(screen.getByTestId('typography-caption')).toHaveTextContent(subtitle);
  });

  it('should apply correct colors to typography elements', () => {
    const subtitle = 'Test subtitle';
    render(<MetricCard {...defaultProps} subtitle={subtitle} />);

    // Title should have text.secondary color
    const titleElement = screen.getByTestId('typography-h6');
    expect(titleElement).toHaveAttribute('data-color', 'text.secondary');

    // Subtitle should have text.secondary color
    const subtitleElement = screen.getByTestId('typography-caption');
    expect(subtitleElement).toHaveAttribute('data-color', 'text.secondary');
  });

  it('should handle zero value correctly', () => {
    render(<MetricCard {...defaultProps} value={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should handle empty string value', () => {
    render(<MetricCard {...defaultProps} value="" />);

    expect(screen.getByTestId('typography-h4')).toHaveTextContent('');
  });

  it('should handle negative numbers', () => {
    render(<MetricCard {...defaultProps} value={-42} />);

    expect(screen.getByText('-42')).toBeInTheDocument();
  });

  it('should handle decimal numbers', () => {
    render(<MetricCard {...defaultProps} value={42.5} />);

    expect(screen.getByText('42.5')).toBeInTheDocument();
  });

  it('should handle large numbers', () => {
    render(<MetricCard {...defaultProps} value={1000000} />);

    expect(screen.getByText('1000000')).toBeInTheDocument();
  });

  it('should render with all props combined', () => {
    render(
      <MetricCard
        title="Complete Test"
        value="99.9%"
        subtitle="All features"
        variant="primary"
        isLoading={false}
      />
    );

    expect(screen.getByText('Complete Test')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
    expect(screen.getByText('All features')).toBeInTheDocument();
    
    const valueElement = screen.getByTestId('typography-h4');
    expect(valueElement).toHaveAttribute('data-color', 'primary.main');
  });
}); 