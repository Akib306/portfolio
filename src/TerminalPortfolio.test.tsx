// @vitest-environment happy-dom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TerminalPortfolio } from './TerminalPortfolio'
import { portfolio } from './data/portfolio'

const firstProject = portfolio.projects[0]

describe('TerminalPortfolio', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.stubGlobal(
			'requestAnimationFrame',
			(callback: FrameRequestCallback) =>
				window.setTimeout(() => callback(performance.now()), 0),
		)
		vi.stubGlobal('cancelAnimationFrame', (handle: number) =>
			window.clearTimeout(handle),
		)
	})

	afterEach(() => {
		cleanup()
		vi.clearAllTimers()
		vi.unstubAllGlobals()
		vi.useRealTimers()
	})

	it('renders the boot sequence and enables the command prompt', () => {
		const input = renderBootedTerminal()

		expect(screen.getByText(`tty0 · ${portfolio.handle} · session opened`)).toBeTruthy()
		expect(screen.getByText(portfolio.blurb)).toBeTruthy()
		expect(screen.getByText(portfolio.location)).toBeTruthy()
		expect(screen.getByText(firstProject.id)).toBeTruthy()
		expect(input).toBeTruthy()
	})

	it('runs commands from the input and clears the prompt value', () => {
		const input = renderBootedTerminal()

		runTextCommand(input, 'help')

		expect(
			screen.getByText(
				'commands · whoami · ls · projects · cat <project-id> · cat location.txt · cat focus.txt · cat contact.txt · clear',
			),
		).toBeTruthy()
		expect(
			screen.getByText(
				'tip · click a project row or use tab to toggle its case study',
			),
		).toBeTruthy()
		expect(input.value).toBe('')
	})

	it('toggles an inline case study from a project row', () => {
		renderBootedTerminal()

		expect(queryProjectCaseStudy(firstProject.id)).toBeNull()

		fireEvent.click(getExpandButton(firstProject))
		flushTimers()

		expect(getProjectCaseStudy(firstProject.id)).toBeTruthy()
		expect(screen.getByText(firstProject.tagline)).toBeTruthy()
		expect(getCollapseButton(firstProject).getAttribute('aria-expanded')).toBe(
			'true',
		)
	})

	it('opens the matching case study for cat <project-id>', () => {
		const input = renderBootedTerminal()

		runTextCommand(input, `cat ${firstProject.id}`)

		expect(getProjectCaseStudy(firstProject.id)).toBeTruthy()
		expect(screen.getByText(firstProject.problem)).toBeTruthy()
	})

	it('shows an error for unknown commands', () => {
		const input = renderBootedTerminal()

		runTextCommand(input, 'frobnicate')

		expect(
			screen.getByText('command not found: frobnicate · try help'),
		).toBeTruthy()
	})

	it('restarts the session when clear is run', () => {
		const input = renderBootedTerminal()
		runTextCommand(input, 'help')

		expect(screen.getByText(/commands · whoami/)).toBeTruthy()

		runTextCommand(input, 'clear', { flush: false })

		expect(screen.queryByRole('textbox', { name: 'Terminal command' })).toBeNull()
		expect(screen.queryByText(/commands · whoami/)).toBeNull()

		flushTimers()

		expect(screen.getByText(`tty0 · ${portfolio.handle} · session opened`)).toBeTruthy()
		expect(screen.getByRole('textbox', { name: 'Terminal command' })).toBeTruthy()
	})
})

function renderBootedTerminal() {
	render(<TerminalPortfolio />)
	flushTimers()
	const input = screen.getByRole('textbox', {
		name: 'Terminal command',
	})

	if (!(input instanceof HTMLInputElement)) {
		throw new TypeError('Expected terminal command control to be an input')
	}

	return input
}

function runTextCommand(
	input: HTMLInputElement,
	command: string,
	options: { flush?: boolean } = {},
) {
	fireEvent.change(input, { target: { value: command } })
	fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
	if (options.flush !== false) {
		flushTimers()
	}
}

function flushTimers() {
	act(() => {
		vi.runAllTimers()
	})
}

function getExpandButton(project: typeof firstProject) {
	return screen.getByRole('button', {
		name: `Expand ${project.id}: ${project.desc}`,
	})
}

function getCollapseButton(project: typeof firstProject) {
	return screen.getByRole('button', {
		name: `Collapse ${project.id}: ${project.desc}`,
	})
}

function getProjectCaseStudy(projectId: string) {
	return screen.getByRole('region', {
		name: `Case study for ${projectId}`,
	})
}

function queryProjectCaseStudy(projectId: string) {
	return screen.queryByRole('region', {
		name: `Case study for ${projectId}`,
	})
}
