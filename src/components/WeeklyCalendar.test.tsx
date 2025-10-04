import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, user } from '../test/utils';
import WeeklyCalendar from './WeeklyCalendar';
import type { MealPlan } from './WeeklyView';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="calendar-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Users: () => <div data-testid="users-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
  Utensils: () => <div data-testid="utensils-icon" />,
}));

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((date: Date, formatStr: string) => {
    if (formatStr === 'MMMM d, yyyy') return 'January 1, 2024';
    if (formatStr === 'MMM d') return 'Jan 1';
    return '2024-01-01';
  }),
  addDays: vi.fn((date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000)),
  startOfWeek: vi.fn((_date: Date) => new Date('2024-01-01')),
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
    {
      day: 'wednesday',
      meal_type: 'breakfast',
      recipe_title: 'Oatmeal with Berries',
      main_protein: 'oats',
      prep_time: 10,
    },
  ],
  available_proteins: ['chicken', 'beef', 'pork'],
  available_vegetables: ['broccoli', 'bell_peppers', 'onions'],
  dietary_preferences: ['high_protein', 'gluten_free'],
  prep_sessions: [
    {
      session_name: 'Sunday Prep',
      duration_minutes: 120,
      tasks: ['Chop vegetables', 'Marinate chicken'],
    },
    {
      session_name: 'Wednesday Prep',
      duration_minutes: 60,
      tasks: ['Prepare sauces', 'Cook grains'],
    },
  ],
  evaluation_score: 8,
};

const emptyMealPlan: MealPlan = {
  week_start_date: '2024-01-01T00:00:00.000Z',
  meals: [],
  available_proteins: [],
  available_vegetables: [],
  dietary_preferences: [],
  prep_sessions: [],
};

describe('WeeklyCalendar', () => {
  const mockOnRegeneratePlan = vi.fn();
  const mockOnMealClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders calendar header with week information', () => {
    render(
      <WeeklyCalendar
        mealPlan={mockMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    expect(screen.getByText('Week of January 1, 2024')).toBeInTheDocument();
    expect(screen.getByText('4 meals planned')).toBeInTheDocument();
  });

  it('renders regenerate plan button', () => {
    render(
      <WeeklyCalendar
        mealPlan={mockMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    const regenerateButton = screen.getByRole('button', { name: /regenerate plan/i });
    expect(regenerateButton).toBeInTheDocument();
  });

  it('calls onRegeneratePlan when regenerate button is clicked', async () => {
    render(
      <WeeklyCalendar
        mealPlan={mockMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    const regenerateButton = screen.getByRole('button', { name: /regenerate plan/i });
    await user.click(regenerateButton);

    expect(mockOnRegeneratePlan).toHaveBeenCalledTimes(1);
  });

  it('renders all days of the week', () => {
    render(
      <WeeklyCalendar
        mealPlan={mockMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('renders meals for each day', () => {
    render(
      <WeeklyCalendar
        mealPlan={mockMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    // Check for specific meals
    expect(screen.getByText('Mediterranean Chicken Bowl')).toBeInTheDocument();
    expect(screen.getByText('Beef & Bell Pepper Stir Fry')).toBeInTheDocument();
    expect(screen.getByText('Leftover Stir Fry')).toBeInTheDocument();
    expect(screen.getByText('Oatmeal with Berries')).toBeInTheDocument();
  });

  it('displays meal types with correct icons and labels', () => {
    render(
      <WeeklyCalendar
        mealPlan={mockMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    expect(screen.getAllByText('Lunch')).toHaveLength(2); // Two lunch meals
    expect(screen.getAllByText('Dinner')).toHaveLength(1);
    expect(screen.getAllByText('Breakfast')).toHaveLength(1);
  });

  it('displays protein information for meals', () => {
    render(
      <WeeklyCalendar
        mealPlan={mockMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    expect(screen.getByText('chicken')).toBeInTheDocument();
    expect(screen.getAllByText('beef')).toHaveLength(2); // Two beef meals
    expect(screen.getByText('oats')).toBeInTheDocument();
  });

  it('displays prep time for meals', () => {
    render(
      <WeeklyCalendar
        mealPlan={mockMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    expect(screen.getByText('30 min')).toBeInTheDocument();
    expect(screen.getByText('25 min')).toBeInTheDocument();
    expect(screen.getByText('5 min')).toBeInTheDocument();
    expect(screen.getByText('10 min')).toBeInTheDocument();
  });

  it('displays dietary tags for meals', () => {
    render(
      <WeeklyCalendar
        mealPlan={mockMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    expect(screen.getByText('high protein')).toBeInTheDocument();
  });

  it('calls onMealClick when a meal is clicked', async () => {
    render(
      <WeeklyCalendar
        mealPlan={mockMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    const mealCard = screen.getByText('Mediterranean Chicken Bowl').closest('div');
    if (mealCard) {
      await user.click(mealCard);
      expect(mockOnMealClick).toHaveBeenCalledWith(mockMealPlan.meals[0]);
    }
  });

  it('shows "No meals planned" for empty days', () => {
    render(
      <WeeklyCalendar
        mealPlan={emptyMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    const noMealsText = screen.getAllByText('No meals planned');
    expect(noMealsText).toHaveLength(7); // One for each day
  });

  it('renders summary statistics', () => {
    render(
      <WeeklyCalendar
        mealPlan={mockMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    // Check protein count (unique proteins)
    expect(screen.getByText('3 Proteins')).toBeInTheDocument();
    expect(screen.getByText('Varied protein sources')).toBeInTheDocument();

    // Check prep sessions count
    expect(screen.getByText('2 Sessions')).toBeInTheDocument();
    expect(screen.getByText('Prep sessions planned')).toBeInTheDocument();

    // Check dietary restrictions count
    expect(screen.getByText('2 Restrictions')).toBeInTheDocument();
    expect(screen.getByText('Dietary needs met')).toBeInTheDocument();
  });

  it('handles empty meal plan gracefully', () => {
    render(
      <WeeklyCalendar
        mealPlan={emptyMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    expect(screen.getByText('0 meals planned')).toBeInTheDocument();
    expect(screen.getByText('0 Proteins')).toBeInTheDocument();
    expect(screen.getByText('0 Sessions')).toBeInTheDocument();
    expect(screen.getByText('0 Restrictions')).toBeInTheDocument();
  });

  it('handles missing optional props gracefully', () => {
    render(
      <WeeklyCalendar
        mealPlan={mockMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
      />
    );

    // Should render without errors even without onMealClick
    expect(screen.getByText('Week of January 1, 2024')).toBeInTheDocument();
  });

  it('applies correct CSS classes for styling', () => {
    render(
      <WeeklyCalendar
        mealPlan={mockMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    // Find the main container by looking for the space-y-6 class
    const container = document.querySelector('.space-y-6');
    expect(container).toBeInTheDocument();
  });

  it('displays correct meal type colors', () => {
    render(
      <WeeklyCalendar
        mealPlan={mockMealPlan}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    // Check that meal type labels have appropriate color classes
    const lunchLabels = screen.getAllByText('Lunch');
    expect(lunchLabels[0]).toHaveClass('text-blue-600');

    const dinnerLabels = screen.getAllByText('Dinner');
    expect(dinnerLabels[0]).toHaveClass('text-purple-600');

    const breakfastLabels = screen.getAllByText('Breakfast');
    expect(breakfastLabels[0]).toHaveClass('text-orange-600');
  });

  it('handles meals without prep time gracefully', () => {
    const mealPlanWithoutPrepTime: MealPlan = {
      ...mockMealPlan,
      meals: [
        {
          day: 'monday',
          meal_type: 'lunch',
          recipe_title: 'Simple Salad',
          main_protein: 'lettuce',
        },
      ],
    };

    render(
      <WeeklyCalendar
        mealPlan={mealPlanWithoutPrepTime}
        onRegeneratePlan={mockOnRegeneratePlan}
        onMealClick={mockOnMealClick}
      />
    );

    expect(screen.getByText('Simple Salad')).toBeInTheDocument();
    // Should not show prep time for meals without it
    expect(screen.queryByText('min')).not.toBeInTheDocument();
  });
});
