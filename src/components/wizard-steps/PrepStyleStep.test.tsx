import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrepStyleStep } from './PrepStyleStep';
import { useWizardStore } from '../../stores/wizardStore';

// Mock the wizard store
vi.mock('../../stores/wizardStore', () => ({
  useWizardStore: vi.fn(),
}));

const mockUseWizardStore = vi.mocked(useWizardStore);

describe('PrepStyleStep', () => {
  const mockSetPrepStyle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWizardStore.mockReturnValue({
      currentStep: 4,
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
      setDietary: vi.fn(),
      setPrepStyle: mockSetPrepStyle,
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });
  });

  it('renders the step title and description', () => {
    render(<PrepStyleStep />);

    expect(
      screen.getByText('How do you prefer to prep meals?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Choose your prep schedule and session length')
    ).toBeInTheDocument();
  });

  it('renders sessions per week section', () => {
    render(<PrepStyleStep />);

    expect(
      screen.getByText('How many prep sessions per week?')
    ).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Default value
  });

  it('renders session duration section', () => {
    render(<PrepStyleStep />);

    expect(screen.getByText('How long per session?')).toBeInTheDocument();
    expect(screen.getByText('1h')).toBeInTheDocument();
    expect(screen.getByText('1.5h 30m')).toBeInTheDocument();
    expect(screen.getByText('2h')).toBeInTheDocument();
    expect(screen.getByText('3h')).toBeInTheDocument();
  });

  it('shows current prep style values from store', () => {
    render(<PrepStyleStep />);

    // Check sessions
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Check duration (2h should be selected)
    const twoHourButton = screen.getByText('2h');
    expect(twoHourButton).toHaveClass('border-primary-500');
  });

  it('calls setPrepStyle when sessions are increased', () => {
    render(<PrepStyleStep />);

    const increaseButton = screen.getByLabelText('Increase sessions');
    fireEvent.click(increaseButton);

    expect(mockSetPrepStyle).toHaveBeenCalledWith({
      sessionsPerWeek: 3,
      sessionDuration: '2h',
    });
  });

  it('calls setPrepStyle when sessions are decreased', () => {
    render(<PrepStyleStep />);

    const decreaseButton = screen.getByLabelText('Decrease sessions');
    fireEvent.click(decreaseButton);

    expect(mockSetPrepStyle).toHaveBeenCalledWith({
      sessionsPerWeek: 1,
      sessionDuration: '2h',
    });
  });

  it('calls setPrepStyle when duration is changed', () => {
    render(<PrepStyleStep />);

    const oneHourButton = screen.getByText('1h');
    fireEvent.click(oneHourButton);

    expect(mockSetPrepStyle).toHaveBeenCalledWith({
      sessionsPerWeek: 2,
      sessionDuration: '1h',
    });
  });

  it('enforces minimum sessions limit', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 4,
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
        sessionsPerWeek: 1,
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
      setPrepStyle: mockSetPrepStyle,
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<PrepStyleStep />);

    const decreaseButton = screen.getByLabelText('Decrease sessions');
    fireEvent.click(decreaseButton);

    // Should not go below 1
    expect(mockSetPrepStyle).toHaveBeenCalledWith({
      sessionsPerWeek: 1,
      sessionDuration: '2h',
    });
  });

  it('enforces maximum sessions limit', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 4,
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
        sessionsPerWeek: 7,
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
      setPrepStyle: mockSetPrepStyle,
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<PrepStyleStep />);

    const increaseButton = screen.getByLabelText('Increase sessions');
    fireEvent.click(increaseButton);

    // Should not go above 7
    expect(mockSetPrepStyle).toHaveBeenCalledWith({
      sessionsPerWeek: 7,
      sessionDuration: '2h',
    });
  });

  it('shows appropriate description for single session', () => {
    mockUseWizardStore.mockReturnValue({
      currentStep: 4,
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
        sessionsPerWeek: 1,
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
      setPrepStyle: mockSetPrepStyle,
      isStepValid: vi.fn(() => true),
      canProceed: vi.fn(() => true),
    });

    render(<PrepStyleStep />);

    expect(screen.getByText('One focused prep session')).toBeInTheDocument();
  });

  it('shows appropriate description for multiple sessions', () => {
    render(<PrepStyleStep />);

    expect(screen.getByText('2 prep sessions per week')).toBeInTheDocument();
  });

  it('shows appropriate duration descriptions', () => {
    render(<PrepStyleStep />);

    expect(screen.getByText('Comprehensive prep for the week')).toBeInTheDocument();
  });

  it('shows prep plan summary', () => {
    render(<PrepStyleStep />);

    expect(screen.getByText('Your prep plan:')).toBeInTheDocument();
    expect(screen.getByText('2 sessions per week, 2h each')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<PrepStyleStep />);

    const increaseButton = screen.getByLabelText('Increase sessions');
    const decreaseButton = screen.getByLabelText('Decrease sessions');
    
    expect(increaseButton).toBeInTheDocument();
    expect(decreaseButton).toBeInTheDocument();
  });

  it('displays all duration options', () => {
    render(<PrepStyleStep />);

    // Check all duration options are displayed
    expect(screen.getByText('1h')).toBeInTheDocument();
    expect(screen.getByText('1.5h 30m')).toBeInTheDocument();
    expect(screen.getByText('2h')).toBeInTheDocument();
    expect(screen.getByText('3h')).toBeInTheDocument();
  });
});
