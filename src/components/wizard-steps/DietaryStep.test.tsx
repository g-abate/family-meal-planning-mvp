import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DietaryStep } from './DietaryStep';
import { useWizardStore } from '../../stores/wizardStore';

// Mock the wizard store
vi.mock('../../stores/wizardStore', () => ({
  useWizardStore: vi.fn(),
}));

const mockUseWizardStore = vi.mocked(useWizardStore);

describe('DietaryStep', () => {
  const mockSetDietary = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWizardStore.mockReturnValue({
      currentStep: 3,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: [],
        availableVegetables: [],
        availableStarches: [],
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
      setDietary: mockSetDietary,
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });
  });

  it('renders the step title and description', () => {
    render(<DietaryStep />);

    expect(
      screen.getByText('Any dietary restrictions to consider?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Select any dietary restrictions (optional)')
    ).toBeInTheDocument();
  });

  it('renders dietary restrictions selection section', () => {
    render(<DietaryStep />);

    expect(screen.getByText('Dietary Restrictions')).toBeInTheDocument();
    expect(screen.getByText('Select dietary restrictions')).toBeInTheDocument();
  });

  it('displays all available dietary restriction options', () => {
    render(<DietaryStep />);

    // Check for some key dietary restriction options
    expect(screen.getByText('Vegetarian')).toBeInTheDocument();
    expect(screen.getByText('Vegan')).toBeInTheDocument();
    expect(screen.getByText('Gluten-Free')).toBeInTheDocument();
    expect(screen.getByText('Keto')).toBeInTheDocument();
    expect(screen.getByText('Mediterranean')).toBeInTheDocument();
  });

  it('shows selected dietary restrictions from store', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 3,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: [],
        availableVegetables: [],
        availableStarches: [],
      },
      dietary: {
        restrictions: ['vegetarian', 'gluten-free'],
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
      setDietary: mockSetDietary,
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<DietaryStep />);

    // Check that Vegetarian radio button is checked
    const vegetarianRadio = screen.getByLabelText('Vegetarian');
    const glutenFreeRadio = screen.getByLabelText('Gluten-Free');
    
    expect(vegetarianRadio).toBeChecked();
    expect(glutenFreeRadio).not.toBeChecked();
  });

  it('calls setDietary when restriction is selected', () => {
    render(<DietaryStep />);

    const vegetarianRadio = screen.getByLabelText('Vegetarian');
    fireEvent.click(vegetarianRadio);

    expect(mockSetDietary).toHaveBeenCalledWith({
      restrictions: ['vegetarian'],
    });
  });

  it('calls setDietary when different restriction is selected', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 3,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: [],
        availableVegetables: [],
        availableStarches: [],
      },
      dietary: {
        restrictions: ['vegetarian'],
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
      setDietary: mockSetDietary,
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<DietaryStep />);

    const veganRadio = screen.getByLabelText('Vegan');
    fireEvent.click(veganRadio);

    expect(mockSetDietary).toHaveBeenCalledWith({
      restrictions: ['vegan'],
    });
  });

  it('handles single dietary restriction selection', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 3,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: [],
        availableVegetables: [],
        availableStarches: [],
      },
      dietary: {
        restrictions: ['vegetarian'],
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
      setDietary: mockSetDietary,
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<DietaryStep />);

    const veganRadio = screen.getByLabelText('Vegan');
    fireEvent.click(veganRadio);

    expect(mockSetDietary).toHaveBeenCalledWith({
      restrictions: ['vegan'],
    });
  });

  it('has proper accessibility attributes', () => {
    render(<DietaryStep />);

    // Check for proper fieldset and legend structure
    const restrictionsFieldset = screen.getByRole('group', { name: 'Dietary Restrictions' });
    expect(restrictionsFieldset).toBeInTheDocument();

    // Check that radio buttons have proper labels
    const vegetarianRadio = screen.getByLabelText('Vegetarian');
    const veganRadio = screen.getByLabelText('Vegan');
    const glutenFreeRadio = screen.getByLabelText('Gluten-Free');

    expect(vegetarianRadio).toBeInTheDocument();
    expect(veganRadio).toBeInTheDocument();
    expect(glutenFreeRadio).toBeInTheDocument();
  });

  it('shows selected dietary restriction', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 3,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: [],
        availableVegetables: [],
        availableStarches: [],
      },
      dietary: {
        restrictions: ['vegetarian'],
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
      setDietary: mockSetDietary,
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<DietaryStep />);

    expect(screen.getByText('Vegetarian selected')).toBeInTheDocument();
  });

  it('shows "None selected" when no dietary restriction is selected', () => {
    render(<DietaryStep />);

    expect(screen.getByText('None selected')).toBeInTheDocument();
  });

  it('displays all dietary restriction options with proper labels', () => {
    render(<DietaryStep />);

    // Check all dietary restriction options are displayed
    expect(screen.getByText('Vegetarian')).toBeInTheDocument();
    expect(screen.getByText('Vegan')).toBeInTheDocument();
    expect(screen.getByText('Gluten-Free')).toBeInTheDocument();
    expect(screen.getByText('Nut-Free')).toBeInTheDocument();
    expect(screen.getByText('Dairy-Free')).toBeInTheDocument();
    expect(screen.getByText('Keto')).toBeInTheDocument();
    expect(screen.getByText('Paleo')).toBeInTheDocument();
    expect(screen.getByText('Low-Carb')).toBeInTheDocument();
    expect(screen.getByText('High-Protein')).toBeInTheDocument();
    expect(screen.getByText('Mediterranean')).toBeInTheDocument();
  });
});
