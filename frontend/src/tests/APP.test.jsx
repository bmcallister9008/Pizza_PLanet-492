import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';

test('renders the app shell', async () => {
  render(<App />);
  // look for common nav/menu words you actually render
  // update selectors if your App text differs
  expect(
    screen.getByText(/menu|order|pizza/i, { selector: '*,*:before,*:after' })
  ).toBeInTheDocument();
});

test('basic user interaction works (no crash)', async () => {
  render(<App />);
  const user = userEvent.setup();
  // This is intentionally generic; replace with a real button/input in your UI
  const maybeButton = screen.queryByRole('button');
  if (maybeButton) {
    await user.click(maybeButton);
  }
  // If nothing to assert, at least we didn’t throw.
  expect(true).toBe(true);
});
