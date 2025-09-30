import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IngredientsStep } from './IngredientsStep';
import { useWizardStore } from '../../stores/wizardStore';

// Mock the wizard store
vi.mock('../../stores/wizardStore', () => ({
  useWizardStore: vi.fn(),
}));

const mockUseWizardStore = vi.mocked(useWizardStore);

describe('IngredientsStep', () => {
  const mockSetIngredients = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWizardStore.mockReturnValue({
      currentStep: 2,
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
      setIngredients: mockSetIngredients,
      setDietary: vi.fn(),
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });
  });

  it('renders the step title and description', () => {
    render(<IngredientsStep />);

    expect(
      screen.getByText('What proteins, vegetables, and starches do you have?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Select the ingredients you have available (optional)')
    ).toBeInTheDocument();
  });

  it('renders protein selection section', () => {
    render(<IngredientsStep />);

    expect(screen.getByText('Proteins')).toBeInTheDocument();
    expect(screen.getByText('Select available proteins')).toBeInTheDocument();
  });

  it('renders vegetable selection section', () => {
    render(<IngredientsStep />);

    expect(screen.getByText('Vegetables')).toBeInTheDocument();
    expect(screen.getByText('Select available vegetables')).toBeInTheDocument();
  });

  it('renders starch selection section', () => {
    render(<IngredientsStep />);

    expect(screen.getByText('Starches')).toBeInTheDocument();
    expect(screen.getByText('Select available starches')).toBeInTheDocument();
  });

  it('displays all available protein options', () => {
    render(<IngredientsStep />);

    // Check for some key protein options
    expect(screen.getByText('Chicken')).toBeInTheDocument();
    expect(screen.getByText('Beef')).toBeInTheDocument();
    expect(screen.getByText('Fish')).toBeInTheDocument();
    expect(screen.getByText('Tofu')).toBeInTheDocument();
    expect(screen.getByText('Eggs')).toBeInTheDocument();
  });

  it('displays all available vegetable options', () => {
    render(<IngredientsStep />);

    // Check for some key vegetable options
    expect(screen.getByText('Broccoli')).toBeInTheDocument();
    expect(screen.getByText('Carrots')).toBeInTheDocument();
    expect(screen.getByText('Bell Peppers')).toBeInTheDocument();
    expect(screen.getByText('Spinach')).toBeInTheDocument();
    expect(screen.getByText('Tomatoes')).toBeInTheDocument();
  });

  it('displays all available starch options', () => {
    render(<IngredientsStep />);

    // Check for some key starch options
    expect(screen.getByText('Rice')).toBeInTheDocument();
    expect(screen.getByText('Quinoa')).toBeInTheDocument();
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.getByText('Bread')).toBeInTheDocument();
    expect(screen.getByText('Oats')).toBeInTheDocument();
  });

  it('shows selected proteins from store', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 2,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: ['Chicken', 'Fish'],
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
      setIngredients: mockSetIngredients,
      setDietary: vi.fn(),
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<IngredientsStep />);

    // Check that Chicken and Fish checkboxes are checked
    const chickenCheckbox = screen.getByLabelText('Chicken');
    const fishCheckbox = screen.getByLabelText('Fish');
    
    expect(chickenCheckbox).toBeChecked();
    expect(fishCheckbox).toBeChecked();
  });

  it('shows selected vegetables from store', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 2,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: [],
        availableVegetables: ['Broccoli', 'Carrots'],
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
      setIngredients: mockSetIngredients,
      setDietary: vi.fn(),
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<IngredientsStep />);

    // Check that Broccoli and Carrots checkboxes are checked
    const broccoliCheckbox = screen.getByLabelText('Broccoli');
    const carrotsCheckbox = screen.getByLabelText('Carrots');
    
    expect(broccoliCheckbox).toBeChecked();
    expect(carrotsCheckbox).toBeChecked();
  });

  it('shows selected starches from store', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 2,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: [],
        availableVegetables: [],
        availableStarches: ['Rice', 'Pasta'],
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
      setIngredients: mockSetIngredients,
      setDietary: vi.fn(),
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<IngredientsStep />);

    // Check that Rice and Pasta checkboxes are checked
    const riceCheckbox = screen.getByLabelText('Rice');
    const pastaCheckbox = screen.getByLabelText('Pasta');
    
    expect(riceCheckbox).toBeChecked();
    expect(pastaCheckbox).toBeChecked();
  });

  it('calls setIngredients when protein is selected', () => {
    render(<IngredientsStep />);

    const chickenCheckbox = screen.getByLabelText('Chicken');
    fireEvent.click(chickenCheckbox);

    expect(mockSetIngredients).toHaveBeenCalledWith({
      availableProteins: ['Chicken'],
    });
  });

  it('calls setIngredients when protein is deselected', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 2,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: ['Chicken'],
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
      setIngredients: mockSetIngredients,
      setDietary: vi.fn(),
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<IngredientsStep />);

    const chickenCheckbox = screen.getByLabelText('Chicken');
    fireEvent.click(chickenCheckbox);

    expect(mockSetIngredients).toHaveBeenCalledWith({
      availableProteins: [],
    });
  });

  it('calls setIngredients when vegetable is selected', () => {
    render(<IngredientsStep />);

    const broccoliCheckbox = screen.getByLabelText('Broccoli');
    fireEvent.click(broccoliCheckbox);

    expect(mockSetIngredients).toHaveBeenCalledWith({
      availableVegetables: ['Broccoli'],
    });
  });

  it('calls setIngredients when vegetable is deselected', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 2,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: [],
        availableVegetables: ['Broccoli'],
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
      setIngredients: mockSetIngredients,
      setDietary: vi.fn(),
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<IngredientsStep />);

    const broccoliCheckbox = screen.getByLabelText('Broccoli');
    fireEvent.click(broccoliCheckbox);

    expect(mockSetIngredients).toHaveBeenCalledWith({
      availableVegetables: [],
    });
  });

  it('calls setIngredients when starch is selected', () => {
    render(<IngredientsStep />);

    const riceCheckbox = screen.getByLabelText('Rice');
    fireEvent.click(riceCheckbox);

    expect(mockSetIngredients).toHaveBeenCalledWith({
      availableStarches: ['Rice'],
    });
  });

  it('calls setIngredients when starch is deselected', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 2,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: [],
        availableVegetables: [],
        availableStarches: ['Rice'],
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
      setIngredients: mockSetIngredients,
      setDietary: vi.fn(),
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<IngredientsStep />);

    const riceCheckbox = screen.getByLabelText('Rice');
    fireEvent.click(riceCheckbox);

    expect(mockSetIngredients).toHaveBeenCalledWith({
      availableStarches: [],
    });
  });

  it('handles multiple protein selections', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 2,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: ['Chicken'],
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
      setIngredients: mockSetIngredients,
      setDietary: vi.fn(),
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<IngredientsStep />);

    const fishCheckbox = screen.getByLabelText('Fish');
    fireEvent.click(fishCheckbox);

    expect(mockSetIngredients).toHaveBeenCalledWith({
      availableProteins: ['Chicken', 'Fish'],
    });
  });

  it('handles multiple vegetable selections', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 2,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: [],
        availableVegetables: ['Broccoli'],
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
      setIngredients: mockSetIngredients,
      setDietary: vi.fn(),
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<IngredientsStep />);

    const carrotsCheckbox = screen.getByLabelText('Carrots');
    fireEvent.click(carrotsCheckbox);

    expect(mockSetIngredients).toHaveBeenCalledWith({
      availableVegetables: ['Broccoli', 'Carrots'],
    });
  });

  it('handles multiple starch selections', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 2,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: [],
        availableVegetables: [],
        availableStarches: ['Rice'],
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
      setIngredients: mockSetIngredients,
      setDietary: vi.fn(),
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<IngredientsStep />);

    const pastaCheckbox = screen.getByLabelText('Pasta');
    fireEvent.click(pastaCheckbox);

    expect(mockSetIngredients).toHaveBeenCalledWith({
      availableStarches: ['Rice', 'Pasta'],
    });
  });

  it('has proper accessibility attributes', () => {
    render(<IngredientsStep />);

    // Check for proper fieldset and legend structure
    const proteinFieldset = screen.getByRole('group', { name: 'Proteins' });
    const vegetableFieldset = screen.getByRole('group', { name: 'Vegetables' });
    const starchFieldset = screen.getByRole('group', { name: 'Starches' });

    expect(proteinFieldset).toBeInTheDocument();
    expect(vegetableFieldset).toBeInTheDocument();
    expect(starchFieldset).toBeInTheDocument();

    // Check that checkboxes have proper labels
    const chickenCheckbox = screen.getByLabelText('Chicken');
    const broccoliCheckbox = screen.getByLabelText('Broccoli');
    const riceCheckbox = screen.getByLabelText('Rice');

    expect(chickenCheckbox).toBeInTheDocument();
    expect(broccoliCheckbox).toBeInTheDocument();
    expect(riceCheckbox).toBeInTheDocument();
  });

  it('shows selection count for proteins', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 2,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: ['Chicken', 'Fish', 'Beef'],
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
      setIngredients: mockSetIngredients,
      setDietary: vi.fn(),
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<IngredientsStep />);

    expect(screen.getByText('3 selected')).toBeInTheDocument();
  });

  it('shows selection count for vegetables', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 2,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: [],
        availableVegetables: ['Broccoli', 'Carrots', 'Spinach', 'Tomatoes'],
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
      setIngredients: mockSetIngredients,
      setDietary: vi.fn(),
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<IngredientsStep />);

    expect(screen.getByText('4 selected')).toBeInTheDocument();
  });

  it('shows selection count for starches', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 2,
      totalSteps: 4,
      isCompleted: false,
      mealCount: {
        mealsPerWeek: 5,
        mealTypes: ['lunch', 'dinner'],
      },
      ingredients: {
        availableProteins: [],
        availableVegetables: [],
        availableStarches: ['Rice', 'Pasta', 'Bread'],
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
      setIngredients: mockSetIngredients,
      setDietary: vi.fn(),
      setPrepStyle: vi.fn(),
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<IngredientsStep />);

    expect(screen.getByText('3 selected')).toBeInTheDocument();
  });

  it('shows "None selected" when no ingredients are selected', () => {
    render(<IngredientsStep />);

    expect(screen.getAllByText('None selected')).toHaveLength(3);
  });
});