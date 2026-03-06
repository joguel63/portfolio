import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import About from "./About";

test("renders About heading", () => {
  render(<About />);
  expect(screen.getByRole('heading', { name: /About/i })).toBeInTheDocument();
});
