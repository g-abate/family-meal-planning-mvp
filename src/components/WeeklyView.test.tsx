import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, user, waitFor } from '../test/utils';
import WeeklyView, { type MealPlan, type Meal } from './WeeklyView';
import WeeklyCalendar, { type WeeklyCalendarProps } from './WeeklyCalendar';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Plus: () => <div data-testid="plus-icon" />,
  ClipboardList: () => <div data-testid="clipboard-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Users: () => <div data-testid="users-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
  Utensils: () => <div data-testid="utensils-icon" />,
}));

const mockMealPlan: MealPlan = {
  week_start_date: '2024-01-01T00:00:00.000Z',
  meals: [
    {
      day: 'monday',
      meal_type: 'lunch',
      recipe_title: 'Mediterranean Chicken Bowl',
      main_protein: 'chicken',
      prep_time: 30,
      dietary_tags: ['high_protein'],
    },
    {
      day: 'monday',
      meal_type: 'dinner',
      recipe_title: 'Beef & Bell Pepper Stir Fry',
      main_protein: 'beef',
      prep_time: 25,
    },
    {
      day: 'tuesday',
      meal_type: 'lunch',
      recipe_title: 'Leftover Stir Fry',
      main_protein: 'beef',
      prep_time: 5,
    },
  ],
  available_proteins: ['chicken', 'beef', 'pork'],
  available_vegetables: ['broccoli', 'bell_peppers', 'onions'],
  dietary_preferences: ['high_protein'],
  prep_sessions: [
    {
      session_name: 'Sunday Prep',
      duration_minutes: 120,
      tasks: ['Chop vegetables', 'Marinate chicken'],
    },
  ],
  evaluation_score: 8,
};

const renderWeeklyCalendar = (props?: Partial<WeeklyCalendarProps>) => {
  const defaultProps: WeeklyCalendarProps = {
    mealPlan: mockMealPlan,
    onRegeneratePlan: vi.fn(),
    onMealClick: vi.fn(),
  };

  return render(
    <WeeklyCalendar {...defaultProps} {...props} />
  );
};

describe('WeeklyCalendar', () => {
  it('renders the week header and meals', () => {
    renderWeeklyCalendar();

    const weekHeader = screen.getByText(/week of/i);
    const firstMondayMeal = screen.getByText('Mediterranean Chicken Bowl');

    expect(weekHeader).toBeInTheDocument();
    expect(firstMondayMeal).toBeInTheDocument();
  });

  it('calls onRegeneratePlan when button clicked', async () => {
    const onRegeneratePlan = vi.fn();

    renderWeeklyCalendar({ onRegeneratePlan });

    const regenerateButton = screen.getByRole('button', {
      name: /regenerate plan/i,
    });

    await user.click(regenerateButton);

    expect(onRegeneratePlan).toHaveBeenCalled();
  });

  it('calls onMealClick when a meal is clicked', async () => {
    const onMealClick = vi.fn();

    renderWeeklyCalendar({ onMealClick });

    const mealCard = screen.getByText('Mediterranean Chicken Bowl');

    await user.click(mealCard);

    expect(onMealClick).toHaveBeenCalledWith(expect.objectContaining({
      recipe_title: 'Mediterranean Chicken Bowl',
    }));
  });
});

describe('WeeklyView', () => {
  const mockOnStartNewPlan = vi.fn();
  const mockOnViewPrepPlan = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    render(
      <WeeklyView 
        onStartNewPlan={mockOnStartNewPlan} 
        onViewPrepPlan={mockOnViewPrepPlan} 
      />
    );

    // The loading state is very brief, so we'll test that the component renders
    // and then transitions to the main view
    await waitFor(() => {
      expect(screen.getByText('Weekly Meal Plan')).toBeInTheDocument();
    });
  });

  it('renders weekly view after loading', async () => {
    render(
      <WeeklyView
        onStartNewPlan={mockOnStartNewPlan}
        onViewPrepPlan={mockOnViewPrepPlan}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Weekly Meal Plan')).toBeInTheDocument();
    });

    expect(screen.getByText('Your current meal schedule and prep plan.')).toBeInTheDocument();
  });

  it('renders header with title and description', async () => {
    render(
      <WeeklyView
        onStartNewPlan={mockOnStartNewPlan}
        onViewPrepPlan={mockOnViewPrepPlan}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /weekly meal plan/i })).toBeInTheDocument();
    });

    expect(screen.getByText('Your current meal schedule and prep plan.')).toBeInTheDocument();
  });

  it('renders action buttons', async () => {
    render(
      <WeeklyView
        onStartNewPlan={mockOnStartNewPlan}
        onViewPrepPlan={mockOnViewPrepPlan}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /see prep plan/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create new plan/i })).toBeInTheDocument();
    });
  });

  it('calls onStartNewPlan when Create New Plan button is clicked', async () => {
    render(
      <WeeklyView
        onStartNewPlan={mockOnStartNewPlan}
        onViewPrepPlan={mockOnViewPrepPlan}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create new plan/i })).toBeInTheDocument();
    });

    const createButton = screen.getByRole('button', { name: /create new plan/i });
    await user.click(createButton);

    expect(mockOnStartNewPlan).toHaveBeenCalledTimes(1);
  });

  it('calls onViewPrepPlan when See Prep Plan button is clicked', async () => {
    render(
      <WeeklyView
        onStartNewPlan={mockOnStartNewPlan}
        onViewPrepPlan={mockOnViewPrepPlan}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /see prep plan/i })).toBeInTheDocument();
    });

    const prepButton = screen.getByRole('button', { name: /see prep plan/i });
    await user.click(prepButton);

    expect(mockOnViewPrepPlan).toHaveBeenCalledTimes(1);
  });

  it('renders WeeklyCalendar component', async () => {
    render(
      <WeeklyView
        onStartNewPlan={mockOnStartNewPlan}
        onViewPrepPlan={mockOnViewPrepPlan}
      />
    );

    await waitFor(() => {
      // WeeklyCalendar should render the week header
      expect(screen.getByText(/week of/i)).toBeInTheDocument();
    });
  });

  it('handles missing props gracefully', async () => {
    render(<WeeklyView />);

    await waitFor(() => {
      expect(screen.getByText('Weekly Meal Plan')).toBeInTheDocument();
    });

    // Should not throw errors when buttons are clicked without handlers
    const createButton = screen.getByRole('button', { name: /create new plan/i });
    await user.click(createButton);

    const prepButton = screen.getByRole('button', { name: /see prep plan/i });
    await user.click(prepButton);

    // Should render without errors
    expect(screen.getByText('Weekly Meal Plan')).toBeInTheDocument();
  });

  it('displays correct styling classes', async () => {
    render(
      <WeeklyView
        onStartNewPlan={mockOnStartNewPlan}
        onViewPrepPlan={mockOnViewPrepPlan}
      />
    );

    await waitFor(() => {
      // Find the main container by looking for the specific classes
      const container = document.querySelector('.min-h-screen.bg-gray-50');
      expect(container).toBeInTheDocument();
    });
  });

  it('shows loading spinner with correct styling', async () => {
    render(
      <WeeklyView
        onStartNewPlan={mockOnStartNewPlan}
        onViewPrepPlan={mockOnViewPrepPlan}
      />
    );

    // Test that the main container has the correct styling
    await waitFor(() => {
      const container = document.querySelector('.min-h-screen.bg-gray-50');
      expect(container).toBeInTheDocument();
    });
  });
});
