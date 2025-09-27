import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
// Re-export everything from testing library
export * from '@testing-library/react';
export { customRender as render };

// Custom user event setup
export const user = userEvent.setup();

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
});

export const createMockMealPlan = (overrides = {}) => ({
  id: '1',
  name: 'Test Meal Plan',
  meals: [],
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockRecipe = (overrides = {}) => ({
  id: '1',
  name: 'Test Recipe',
  description: 'A test recipe',
  prepTime: 30,
  cookTime: 45,
  servings: 4,
  ingredients: [],
  instructions: [],
  dietaryTags: [],
  ...overrides,
});

// Custom matchers for meal planning specific assertions
export const expectToBeAccessible = (container: HTMLElement) => {
  // Check for proper heading hierarchy
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  expect(headings.length).toBeGreaterThan(0);

  // Check for proper form labels
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    if (id) {
      const label = container.querySelector(`label[for="${id}"]`);
      expect(label).toBeInTheDocument();
    }
  });

  // Check for proper button labels
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    const text = button.textContent?.trim();
    const ariaLabel = button.getAttribute('aria-label');
    expect(text ?? ariaLabel).toBeTruthy();
  });
};

export const expectToHaveFocus = (element: HTMLElement) => {
  expect(element).toHaveFocus();
};

export const expectToBeInDocument = (element: HTMLElement | null) => {
  expect(element).toBeInTheDocument();
};

export const expectToHaveTextContent = (element: HTMLElement, text: string) => {
  expect(element).toHaveTextContent(text);
};

export const expectToHaveClass = (element: HTMLElement, className: string) => {
  expect(element).toHaveClass(className);
};

export const expectToHaveAttribute = (
  element: HTMLElement,
  attribute: string,
  value?: string
) => {
  if (value) {
    expect(element).toHaveAttribute(attribute, value);
  } else {
    expect(element).toHaveAttribute(attribute);
  }
};
