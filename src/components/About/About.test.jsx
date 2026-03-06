import { render, screen } from "@testing-library/react";
import About from "./About";

test("renders About heading", () => {
  render(<About />);
  expect(screen.getByText(/About/i)).toBeInTheDocument();
});
