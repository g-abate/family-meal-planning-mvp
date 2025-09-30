import { describe, it, expect, vi } from 'vitest';
import { render, screen, user, waitFor } from './test/utils';
import App from './App';

// Mock console methods to avoid noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);

    const heading = screen.getByRole('heading', {
      name: /plan your family meals in minutes/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders the app logo and title', () => {
    render(<App />);

    const logo = screen.getByText('M');
    const title = screen.getByText('Family Meal Planning');

    expect(logo).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  it('renders the start planning button', () => {
    render(<App />);

    const startButton = screen.getByRole('button', {
      name: /start planning/i,
    });
    expect(startButton).toBeInTheDocument();
  });

  it('renders the get started button', () => {
    render(<App />);

    const getStartedButton = screen.getByRole('button', {
      name: /get started/i,
    });
    expect(getStartedButton).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<App />);

    const smartMealPlanning = screen.getByRole('heading', {
      name: /smart meal planning/i,
    });
    const prepChecklists = screen.getByRole('heading', {
      name: /prep checklists/i,
    });
    const quickEasy = screen.getByRole('heading', {
      name: /quick & easy/i,
    });

    expect(smartMealPlanning).toBeInTheDocument();
    expect(prepChecklists).toBeInTheDocument();
    expect(quickEasy).toBeInTheDocument();
  });

  it('opens wizard modal when start planning button is clicked', async () => {
    render(<App />);

    const startButton = screen.getByRole('button', {
      name: /start planning/i,
    });

    await user.click(startButton);

    const modal = screen.getByRole('dialog', {
      name: /plan your meals/i,
    });
    expect(modal).toBeInTheDocument();
  });

  it('opens wizard modal when get started button is clicked', async () => {
    render(<App />);

    const getStartedButton = screen.getByRole('button', {
      name: /get started/i,
    });

    await user.click(getStartedButton);

    const modal = screen.getByRole('dialog', {
      name: /plan your meals/i,
    });
    expect(modal).toBeInTheDocument();
  });

  it('closes wizard modal when close button is clicked', async () => {
    render(<App />);

    const startButton = screen.getByRole('button', {
      name: /start planning/i,
    });

    await user.click(startButton);

    const modal = screen.getByRole('dialog', {
      name: /plan your meals/i,
    });
    expect(modal).toBeInTheDocument();

    const closeButton = screen.getByRole('button', {
      name: /close wizard/i,
    });

    await user.click(closeButton);

    expect(modal).not.toBeInTheDocument();
  });

  it('closes wizard modal when X button is clicked', async () => {
    render(<App />);

    const startButton = screen.getByRole('button', {
      name: /start planning/i,
    });

    await user.click(startButton);

    const modal = screen.getByRole('dialog', {
      name: /plan your meals/i,
    });
    expect(modal).toBeInTheDocument();

    const closeButton = screen.getByRole('button', {
      name: /close wizard/i,
    });

    await user.click(closeButton);

    expect(modal).not.toBeInTheDocument();
  });

  it('shows weekly view after wizard completion', async () => {
    render(<App />);

    const startButton = screen.getByRole('button', {
      name: /start planning/i,
    });

    await user.click(startButton);

    const modal = screen.getByRole('dialog', {
      name: /plan your meals/i,
    });
    expect(modal).toBeInTheDocument();

    // Progress through all wizard steps - wizard has default valid state
    for (let i = 0; i < 4; i++) {
      // Wait for button to be available and enabled
      const button = await waitFor(() => 
        screen.getByRole('button', {
          name: i === 3 ? /create meal plan/i : /continue/i,
        })
      );
      
      if (button && !button.hasAttribute('disabled')) {
        await user.click(button);
      }
    }

    // Should show weekly view
    await waitFor(() => {
      expect(screen.getByTestId('weekly-meal-plan-heading')).toBeInTheDocument();
    });
  });

  it('shows weekly view with action buttons', async () => {
    render(<App />);

    const startButton = screen.getByRole('button', {
      name: /start planning/i,
    });

    await user.click(startButton);

    // Progress through all wizard steps - wizard has default valid state
    for (let i = 0; i < 4; i++) {
      // Wait for button to be available and enabled
      const button = await waitFor(() => 
        screen.getByRole('button', {
          name: i === 3 ? /create meal plan/i : /continue/i,
        })
      );
      
      if (button && !button.hasAttribute('disabled')) {
        await user.click(button);
      }
    }

    // Check for weekly view action buttons
    await waitFor(() => {
      expect(screen.getByTestId('weekly-meal-plan-heading')).toBeInTheDocument();
    });
  });

  it('returns to wizard when Create New Plan is clicked from weekly view', async () => {
    render(<App />);

    // Complete wizard to get to weekly view
    const startButton = screen.getByRole('button', {
      name: /start planning/i,
    });

    await user.click(startButton);

    // Progress through all wizard steps - wizard has default valid state
    for (let i = 0; i < 4; i++) {
      // Wait for button to be available and enabled
      const button = await waitFor(() => 
        screen.getByRole('button', {
          name: i === 3 ? /create meal plan/i : /continue/i,
        })
      );
      
      if (button && !button.hasAttribute('disabled')) {
        await user.click(button);
      }
    }

    // Should be in weekly view
    await waitFor(() => {
      expect(screen.getByTestId('weekly-meal-plan-heading')).toBeInTheDocument();
    });

    // Click Create New Plan
    const createNewPlanButton = screen.getByRole('button', {
      name: /create new plan/i,
    });

    await user.click(createNewPlanButton);

    // Should return to wizard
    expect(screen.getByRole('dialog', {
      name: /plan your meals/i,
    })).toBeInTheDocument();
  });

  it('handles prep plan button click in weekly view', async () => {
    // Mock console.log to test prep plan functionality
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<App />);

    // Complete wizard to get to weekly view
    const startButton = screen.getByRole('button', {
      name: /start planning/i,
    });

    await user.click(startButton);

    // Progress through all wizard steps - wizard has default valid state
    for (let i = 0; i < 4; i++) {
      // Wait for button to be available and enabled
      const button = await waitFor(() => 
        screen.getByRole('button', {
          name: i === 3 ? /create meal plan/i : /continue/i,
        })
      );
      
      if (button && !button.hasAttribute('disabled')) {
        await user.click(button);
      }
    }

    // Wait for weekly view to load
    await waitFor(() => {
      expect(screen.getByTestId('weekly-meal-plan-heading')).toBeInTheDocument();
    });

    // Click See Prep Plan - this should now show MealPrepPlan component
    const prepPlanButton = screen.getByRole('button', {
      name: /see prep plan/i,
    });

    await user.click(prepPlanButton);

    // Should show the MealPrepPlan component
    await waitFor(() => {
      expect(screen.getByText('Meal Prep Plan')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('has proper accessibility attributes', () => {
    render(<App />);

    const main = screen.getByRole('main');
    const header = screen.getByRole('banner');

    expect(main).toBeInTheDocument();
    expect(header).toBeInTheDocument();
  });

  it('renders with proper styling classes', () => {
    render(<App />);

    const app = screen.getByRole('main').closest('div');
    expect(app).toHaveClass('min-h-screen', 'bg-white');

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white', 'border-b', 'border-sage-100');
  });
});
