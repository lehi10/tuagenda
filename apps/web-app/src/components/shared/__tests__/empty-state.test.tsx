import { render, screen } from '@testing-library/react'
import { Calendar } from 'lucide-react'
import { EmptyState } from '../empty-state'

describe('EmptyState', () => {
  it('renders correctly with all props', () => {
    render(
      <EmptyState
        icon={Calendar}
        title="No events"
        description="You have no scheduled events for today"
      />
    )

    expect(screen.getByText('No events')).toBeInTheDocument()
    expect(screen.getByText('You have no scheduled events for today')).toBeInTheDocument()
  })

  it('displays the provided icon', () => {
    const { container } = render(
      <EmptyState
        icon={Calendar}
        title="Test Title"
        description="Test Description"
      />
    )

    // Verify that the svg icon component is present
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('h-12', 'w-12', 'text-muted-foreground')
  })

  it('applies correct CSS classes', () => {
    const { container } = render(
      <EmptyState
        icon={Calendar}
        title="Test"
        description="Test description"
      />
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
  })

  it('renders title as h3', () => {
    render(
      <EmptyState
        icon={Calendar}
        title="Empty Title"
        description="Description"
      />
    )

    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveTextContent('Empty Title')
  })
})
