import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';

// Mock React DOM
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

// Mock the App component
vi.mock('./App', () => ({
  default: () => <div data-testid='app'>App Component</div>,
}));

// Mock CSS import
vi.mock('./index.css', () => ({}));

describe('main.tsx', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';

    // Create a root element
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  });

  it('renders the App component', async () => {
    // Import and execute the main module
    await import('./main');

    expect(createRoot).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'root',
      })
    );
  });

  it('loads without errors', async () => {
    // Test that the module loads without throwing errors
    await expect(import('./main')).resolves.toBeDefined();
  });
});
