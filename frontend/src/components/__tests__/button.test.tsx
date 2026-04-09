import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renders without crashing", () => {
    const { container } = render(<Button>Click me</Button>)
    expect(container.firstChild).toBeTruthy()
  })

  it("renders children text", () => {
    render(<Button>Submit</Button>)
    expect(screen.getByText("Submit")).toBeTruthy()
  })

  it("applies default variant class", () => {
    const { container } = render(<Button>Default</Button>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain("bg-primary")
  })

  it("applies outline variant class", () => {
    const { container } = render(<Button variant="outline">Outline</Button>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain("border-border")
  })
})
