import { describe, it, expect, vi } from 'vitest';
import { render, screen, user } from './test/utils';
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
      name: /meal planning wizard/i,
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
      name: /meal planning wizard/i,
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
      name: /meal planning wizard/i,
    });
    expect(modal).toBeInTheDocument();

    const closeButton = screen.getByRole('button', {
      name: /close/i,
    });

    await user.click(closeButton);

    expect(modal).not.toBeInTheDocument();
  });

  it('closes wizard modal when continue button is clicked', async () => {
    render(<App />);

    const startButton = screen.getByRole('button', {
      name: /start planning/i,
    });

    await user.click(startButton);

    const modal = screen.getByRole('dialog', {
      name: /meal planning wizard/i,
    });
    expect(modal).toBeInTheDocument();

    const continueButton = screen.getByRole('button', {
      name: /continue/i,
    });

    await user.click(continueButton);

    expect(modal).not.toBeInTheDocument();
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
