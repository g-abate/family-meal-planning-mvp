import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MealPrepPlan from './MealPrepPlan';

describe('MealPrepPlan', () => {
  it('renders the prep plan with all phases', () => {
    const mockOnBack = vi.fn();
    render(<MealPrepPlan onBack={mockOnBack} />);

    // Check header
    expect(screen.getByText('Meal Prep Plan')).toBeInTheDocument();
    expect(screen.getByText('Your complete 2-hour prep strategy')).toBeInTheDocument();

    // Check summary section
    expect(screen.getByText('In 2 Hours You\'ll Have')).toBeInTheDocument();
    expect(screen.getByText('Lunches Ready')).toBeInTheDocument();
    expect(screen.getByText('Dinners Staged')).toBeInTheDocument();
    expect(screen.getByText('2 Hours')).toBeInTheDocument();

    // Check all phases are present
    expect(screen.getByText('Phase 1: Setup')).toBeInTheDocument();
    expect(screen.getByText('Phase 2: Knife Work & Marinades')).toBeInTheDocument();
    expect(screen.getByText('Phase 3: Oven Batch Roast')).toBeInTheDocument();
    expect(screen.getByText('Phase 4: Stovetop Proteins')).toBeInTheDocument();
    expect(screen.getByText('Phase 5: Starches')).toBeInTheDocument();
    expect(screen.getByText('Phase 6: Assembly & Storage')).toBeInTheDocument();

    // Check phase durations
    expect(screen.getByText('10 min')).toBeInTheDocument();
    expect(screen.getByText('20 min')).toBeInTheDocument();
    expect(screen.getByText('40 min, overlapping')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const mockOnBack = vi.fn();
    render(<MealPrepPlan onBack={mockOnBack} />);

    const backButton = screen.getByLabelText('Go back');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('displays important prep tasks', () => {
    const mockOnBack = vi.fn();
    render(<MealPrepPlan onBack={mockOnBack} />);

    // Check for key prep tasks
    expect(screen.getByText('Clear counters, set up prep → cook → storage triangle')).toBeInTheDocument();
    expect(screen.getByText('Preheat oven to 200°C / 400°F')).toBeInTheDocument();
    expect(screen.getByText('Color-coded cutting boards (raw vs veg)')).toBeInTheDocument();
    expect(screen.getByText('Veg prep: Dice broccoli, bell peppers, carrots, pumpkin')).toBeInTheDocument();
    expect(screen.getByText('Sheet Pan 1 (traybake): Pumpkin + sausages')).toBeInTheDocument();
  });

  it('shows success message at the end', () => {
    const mockOnBack = vi.fn();
    render(<MealPrepPlan onBack={mockOnBack} />);

    expect(screen.getByText('You\'re All Set!')).toBeInTheDocument();
    expect(screen.getByText(/Follow this plan step by step/)).toBeInTheDocument();
  });
});
