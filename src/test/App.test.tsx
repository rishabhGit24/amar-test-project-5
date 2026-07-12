import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App shell', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Streaks')
  })

  it('renders the empty state when no habits exist', () => {
    render(<App />)
    expect(
      screen.getByRole('region', { name: /no habits yet/i })
    ).toBeInTheDocument()
  })

  it('shows the empty state heading', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 2, name: /your journey starts here/i })
    ).toBeInTheDocument()
  })

  it('shows the CTA button', () => {
    render(<App />)
    expect(
      screen.getByRole('button', { name: /add your first habit/i })
    ).toBeInTheDocument()
  })
})
