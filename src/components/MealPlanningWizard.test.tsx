import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MealPlanningWizard } from './MealPlanningWizard';

// Mock the wizard store
vi.mock('../stores/wizardStore', () => ({
  useWizardStore: vi.fn(() => ({
    currentStep: 1,
    totalSteps: 4,
    isCompleted: false,
    mealCount: {
      mealsPerWeek: 5,
      mealTypes: ['lunch', 'dinner'],
    },
    ingredients: {
      availableProteins: [],
      availableVegetables: [],
    },
    dietary: {
      restrictions: [],
    },
    prepStyle: {
      sessionsPerWeek: 2,
      sessionDuration: '2h',
    },
    setCurrentStep: vi.fn(),
    nextStep: vi.fn(),
    previousStep: vi.fn(),
    completeWizard: vi.fn(),
    resetWizard: vi.fn(),
    setMealCount: vi.fn(),
    setIngredients: vi.fn(),
    setDietary: vi.fn(),
    setPrepStyle: vi.fn(),
    isStepValid: vi.fn(() => true),
    canProceed: vi.fn(() => true),
  })),
}));

describe('MealPlanningWizard', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders wizard container with progress indicator', () => {
    render(<MealPlanningWizard isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Plan Your Meals')).toBeInTheDocument();
    expect(
      screen.getByText("Let's create your perfect weekly meal plan")
    ).toBeInTheDocument();
    expect(screen.getByText('Quick Setup')).toBeInTheDocument();
  });

  it('shows correct progress for step 1', () => {
    render(<MealPlanningWizard isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    expect(screen.getByText('25% complete')).toBeInTheDocument();
    // Check for the step title in the progress section specifically using getAllByText
    const mealCountElements = screen.getAllByText('Meal Count');
    expect(mealCountElements).toHaveLength(2); // One in progress, one in content
  });

  it('displays step content based on current step', () => {
    render(<MealPlanningWizard isOpen={true} onClose={mockOnClose} />);

    // Step 1 should show meal count form
    expect(
      screen.getByText('How many meals do you need this week?')
    ).toBeInTheDocument();
    expect(screen.getByText('How many meals this week?')).toBeInTheDocument();
    expect(screen.getByText('Which meal types?')).toBeInTheDocument();
  });

  it('has accessible navigation buttons', () => {
    render(<MealPlanningWizard isOpen={true} onClose={mockOnClose} />);

    const backButton = screen.getByRole('button', { name: /back/i });
    const continueButton = screen.getByRole('button', { name: /continue/i });

    expect(backButton).toBeInTheDocument();
    expect(continueButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<MealPlanningWizard isOpen={true} onClose={mockOnClose} />);

    // Use the specific "Close" button in the footer
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(<MealPlanningWizard isOpen={true} onClose={mockOnClose} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'wizard-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'wizard-description');
  });

  it('focuses first input when wizard opens', () => {
    render(<MealPlanningWizard isOpen={true} onClose={mockOnClose} />);

    // The first focusable element should be focused
    const firstInput = screen.getByDisplayValue('5'); // meal count input
    expect(document.activeElement).toBe(firstInput);
  });
});
