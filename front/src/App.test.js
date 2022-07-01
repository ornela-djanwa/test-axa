import { render, screen } from '@testing-library/react';
import App from './App';
const CHART_NAME = "Stocks";

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(CHART_NAME);
  expect(linkElement).toBeInTheDocument();
});
