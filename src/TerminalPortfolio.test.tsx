// @vitest-environment happy-dom

import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
	within,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TerminalPortfolio } from './TerminalPortfolio'
import { runPortfolioCommand } from './commands'
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

	it('renders experiences by default and keeps projects available on demand', () => {
		const input = renderBootedTerminal()

		expect(
			screen.getByText(`tty0 · ${portfolio.handle} · session opened`),
		).toBeTruthy()
		expect(screen.getByText(portfolio.blurb)).toBeTruthy()
		expect(screen.getByText(portfolio.location)).toBeTruthy()
		expect(screen.getByText(portfolio.experience[0].id)).toBeTruthy()
		expect(screen.queryByText(firstProject.id)).toBeNull()
		expect(input).toBeTruthy()
	})

	it('renders the portrait immediately and restores a fresh rotation on clear', () => {
		const input = renderBootedTerminal()
		const portrait = screen.getByRole('img', {
			name: `ASCII portrait of ${portfolio.name}`,
		})
		const initialFrame = portrait.querySelector('pre')!.textContent
		expect(
			portrait.querySelector('pre')?.textContent.split('\n'),
		).toHaveLength(54)
		fireEvent.click(
			screen.getByRole('button', { name: 'Pause portrait rotation' }),
		)
		expect(portrait.querySelector('pre')!.textContent).toBe(initialFrame)
		runTextCommand(input, 'clear')
		const restored = screen.getByRole('img', {
			name: `ASCII portrait of ${portfolio.name}`,
		})
		expect(restored).not.toBe(portrait)
		expect(restored.closest('.terminal-boot-line')).toBeTruthy()
		expect(restored.querySelector('pre')!.textContent).toBe(initialFrame)
		expect(
			screen.getByRole('button', { name: 'Pause portrait rotation' }),
		).toBeTruthy()
	})

	it('pauses portrait rotation when the page is hidden', () => {
		renderBootedTerminal()
		const portrait = screen.getByRole('img', {
			name: `ASCII portrait of ${portfolio.name}`,
		})
		const visibility = vi.spyOn(document, 'hidden', 'get')
		visibility.mockReturnValue(true)
		fireEvent(document, new Event('visibilitychange'))
		expect(portrait.getAttribute('data-page-visible')).toBe('false')
		visibility.mockReturnValue(false)
		fireEvent(document, new Event('visibilitychange'))
		expect(portrait.getAttribute('data-page-visible')).toBe('true')
		visibility.mockRestore()
	})

	it('runs commands from the input and clears the prompt value', () => {
		const input = renderBootedTerminal()

		runTextCommand(input, 'help')

		expect(
			screen.getByText(
				'commands · whoami · ls · ls projects · ls experiences · clear',
			),
		).toBeTruthy()
		expect(
			screen.getByText(
				'tip · Enter runs a command; Tab moves between controls; open any row to read details',
			),
		).toBeTruthy()
		expect(input.value).toBe('')
	})

	it('toggles an inline case study from a project row', () => {
		renderBootedTerminal({ projects: true })

		expect(queryProjectCaseStudy(firstProject.id)).toBeNull()

		fireEvent.click(getExpandButton(firstProject))
		flushTimers()

		expect(getProjectCaseStudy(firstProject.id)).toBeTruthy()
		expect(
			within(getProjectCaseStudy(firstProject.id)).getByText(
				firstProject.tagline,
			),
		).toBeTruthy()
		expect(
			getCollapseButton(firstProject).getAttribute('aria-expanded'),
		).toBe('true')
	})

	it('opens the matching case study for cat <project-id>', () => {
		const input = renderBootedTerminal()

		runTextCommand(input, `cat ${firstProject.id}`)

		expect(getProjectCaseStudy(firstProject.id)).toBeTruthy()
		expect(screen.getByText(firstProject.problem)).toBeTruthy()
	})

	it('shows project and experiences command chips instead of a bare ls chip', () => {
		renderBootedTerminal()

		expect(
			screen.getByRole('button', { name: 'Run ls projects' }),
		).toBeTruthy()
		expect(
			screen.getByRole('button', { name: 'Run ls experiences' }),
		).toBeTruthy()
		expect(screen.queryByRole('button', { name: 'Run ls' })).toBeNull()
	})

	it('lists directories and files relative to the home directory', () => {
		const result = runPortfolioCommand('ls', portfolio, 'test')
		expect(
			result.lines.flatMap((line) =>
				line.kind === 'output' ? [line.text] : [],
			),
		).toEqual(['projects', 'experiences', 'location.txt', 'socials.txt'])
	})

	it('lists projects only for ls projects', () => {
		const result = runPortfolioCommand('ls projects', portfolio, 'test')
		const listLine = result.lines.find((line) => line.kind === 'list')

		expect(listLine?.kind).toBe('list')
		if (listLine?.kind !== 'list') {
			throw new TypeError('Expected a project list line')
		}
		expect(listLine.projectIds).toEqual(
			portfolio.projects.map((project) => project.id),
		)
		expect(
			result.lines.some((line) => line.kind === 'experience-list'),
		).toBe(false)
	})

	it('lists experience only for ls experiences', () => {
		const result = runPortfolioCommand('ls experiences', portfolio, 'test')
		const listLine = result.lines.find(
			(line) => line.kind === 'experience-list',
		)

		expect(listLine?.kind).toBe('experience-list')
		if (listLine?.kind !== 'experience-list') {
			throw new TypeError('Expected an experience list line')
		}
		expect(listLine.experienceIds).toEqual(
			portfolio.experience.map((experience) => experience.id),
		)
		expect(result.lines.some((line) => line.kind === 'list')).toBe(false)
	})

	it('accepts relative and home directory paths', () => {
		const projectResult = runPortfolioCommand(
			'ls ./projects/',
			portfolio,
			'test',
		)
		const experienceResult = runPortfolioCommand(
			'ls ~/experiences',
			portfolio,
			'test',
		)

		expect(projectResult.lines.some((line) => line.kind === 'list')).toBe(
			true,
		)
		expect(
			experienceResult.lines.some(
				(line) => line.kind === 'experience-list',
			),
		).toBe(true)
	})

	it('shows an error for unknown commands', () => {
		const input = renderBootedTerminal()

		runTextCommand(input, 'frobnicate')

		expect(
			screen.getByText('command not found: frobnicate · try help'),
		).toBeTruthy()
	})

	it('resets the session with a fade-in while keeping controls available', () => {
		const input = renderBootedTerminal({ projects: true })
		runTextCommand(input, 'help')
		runTextCommand(input, 'clear', { flush: false })
		expect(screen.queryByText(/commands · whoami/)).toBeNull()
		expect(screen.getByRole('textbox', { name: 'Terminal command' })).toBe(
			input,
		)
		expect(screen.getByText(portfolio.experience[0].id)).toBeTruthy()
		expect(screen.queryByText(firstProject.id)).toBeNull()
		expect(screen.getByText(portfolio.blurb)).toBeTruthy()
		expect(
			document.querySelectorAll('.terminal-boot-line').length,
		).toBeGreaterThan(0)
	})

	it('renders content immediately without advancing timers', () => {
		render(<TerminalPortfolio />)
		expect(screen.getByText(portfolio.blurb)).toBeTruthy()
		expect(screen.getByText(portfolio.experience[0].id)).toBeTruthy()
		expect(screen.queryByText(firstProject.id)).toBeNull()
		expect(
			screen.getByRole('textbox', { name: 'Terminal command' }),
		).toBeTruthy()
	})

	it('keeps Tab and Shift+Tab available for native focus navigation', () => {
		const input = renderBootedTerminal()
		input.focus()
		expect(fireEvent.keyDown(input, { key: 'Tab' })).toBe(true)
		expect(fireEvent.keyDown(input, { key: 'Tab', shiftKey: true })).toBe(
			true,
		)
		expect(queryProjectCaseStudy(firstProject.id)).toBeNull()
	})

	it('toggles the selected project using the documented alternate shortcut', () => {
		const input = renderBootedTerminal({ projects: true })
		fireEvent.keyDown(input, { key: 'ArrowRight', altKey: true })
		expect(getProjectCaseStudy(firstProject.id)).toBeTruthy()
		fireEvent.keyDown(input, { key: 'ArrowRight', altKey: true })
		expect(queryProjectCaseStudy(firstProject.id)).toBeNull()
	})

	it('preserves project button focus when a case study opens', () => {
		const input = renderBootedTerminal({ projects: true })
		const button = getExpandButton(firstProject)
		button.focus()
		fireEvent.click(button)
		flushTimers()
		expect(document.activeElement).toBe(button)
		expect(document.activeElement).not.toBe(input)
	})

	it('does not scroll to the bottom when a case study opens', () => {
		renderBootedTerminal({ projects: true })
		const output = screen.getByRole('region', { name: 'Terminal output' })
		Object.defineProperty(output, 'scrollHeight', {
			configurable: true,
			value: 2000,
		})
		output.scrollTop = 100
		fireEvent.click(getExpandButton(firstProject))
		flushTimers()
		expect(output.scrollTop).toBe(100)
	})

	it('preserves reading position when output is appended while scrolled up', () => {
		const input = renderBootedTerminal()
		const output = screen.getByRole('region', { name: 'Terminal output' })
		Object.defineProperty(output, 'scrollHeight', {
			configurable: true,
			value: 2000,
		})
		Object.defineProperty(output, 'clientHeight', {
			configurable: true,
			value: 400,
		})
		output.scrollTop = 100
		runTextCommand(input, 'help')
		expect(output.scrollTop).toBe(100)
	})

	it('offers a way to reach new output without interrupting reading', () => {
		const input = renderBootedTerminal()
		const output = screen.getByRole('region', { name: 'Terminal output' })
		Object.defineProperty(output, 'scrollHeight', {
			configurable: true,
			value: 2000,
		})
		Object.defineProperty(output, 'clientHeight', {
			configurable: true,
			value: 400,
		})
		output.scrollTop = 100
		runTextCommand(input, 'help')
		fireEvent.click(
			screen.getByRole('button', { name: 'Show latest output ↓' }),
		)
		expect(output.scrollTop).toBe(2000)
		expect(
			screen.queryByRole('button', { name: 'Show latest output ↓' }),
		).toBeNull()
	})

	it('follows new command output when already at the bottom', () => {
		const input = renderBootedTerminal()
		const output = screen.getByRole('region', { name: 'Terminal output' })
		Object.defineProperty(output, 'scrollHeight', {
			configurable: true,
			value: 2000,
		})
		Object.defineProperty(output, 'clientHeight', {
			configurable: true,
			value: 400,
		})
		output.scrollTop = 1600
		runTextCommand(input, 'help')
		expect(output.scrollTop).toBe(2000)
	})

	it('ignores empty commands and preserves drafts when shortcuts run', () => {
		const input = renderBootedTerminal()
		const output = screen.getByRole('region', { name: 'Terminal output' })
		const initialOutput = output.innerHTML
		runTextCommand(input, '   ')
		expect(output.innerHTML).toBe(initialOutput)
		fireEvent.change(input, { target: { value: 'cat campus-find.app' } })
		fireEvent.click(screen.getByRole('button', { name: 'Run help' }))
		expect(input.value).toBe('cat campus-find.app')
	})

	it('normalizes whitespace and capitalization in commands', () => {
		const result = runPortfolioCommand(
			'  CAT   ' + firstProject.id.toUpperCase() + '  ',
			portfolio,
			'test',
		)
		expect(result.openProjectId).toBe(firstProject.id)
		expect(
			runPortfolioCommand('LS    PROJECTS', portfolio, 'test').lines.some(
				(line) => line.kind === 'list',
			),
		).toBe(true)
	})

	it('lists social links on command without a navigation bar or email', () => {
		const input = renderBootedTerminal({ projects: true })
		expect(screen.queryByRole('navigation')).toBeNull()
		expect(
			screen.queryByRole('list', { name: 'Social profiles' }),
		).toBeNull()
		runTextCommand(input, 'socials')
		expect(screen.queryByRole('link', { name: 'Email' })).toBeNull()
		expect(screen.queryByRole('button', { name: /^Run$/ })).toBeNull()
		expect(document.querySelector('.terminal-caret')).toBeNull()
		for (const link of portfolio.socials) {
			expect(
				screen
					.getByRole('link', {
						name: link.label + ' (opens in a new tab)',
					})
					.getAttribute('href'),
			).toBe(link.href)
		}
		fireEvent.click(
			screen.getByRole('button', { name: 'Run cat socials.txt' }),
		)
		expect(screen.getByRole('status', { name: '' }).textContent).toBe(
			'cat socials.txt completed. Read the terminal output.',
		)
		expect(
			screen.getAllByRole('list', { name: 'Social profiles' }),
		).toHaveLength(2)
		fireEvent.click(getExpandButton(firstProject))
		expect(
			screen.getByRole('link', {
				name:
					firstProject.id + ': Source on GitHub (opens in a new tab)',
			}),
		).toBeTruthy()
	})
	it('rejects absolute paths with guidance to relative directories', () => {
		for (const path of ['/projects', '/experiences']) {
			const result = runPortfolioCommand(`ls ${path}`, portfolio, 'test')
			expect(result.lines[0]).toMatchObject({
				kind: 'error',
				text: `ls: cannot access '${path}' · try ls projects or ls experiences`,
			})
		}
	})

	it('expands experience details and preserves focus when collapsing', () => {
		renderBootedTerminal()
		const experience = portfolio.experience[1]
		const button = screen.getByRole('button', {
			name: `Expand ${experience.id}: ${experience.desc}`,
		})
		button.focus()
		fireEvent.click(button)
		expect(
			screen.getByRole('region', {
				name: `Experience details for ${experience.id}`,
			}),
		).toBeTruthy()
		expect(screen.getByText(experience.summary)).toBeTruthy()
		expect(screen.getByText(experience.highlights[0].detail)).toBeTruthy()
		expect(document.activeElement).toBe(button)
		fireEvent.click(button)
		expect(
			screen.queryByRole('region', {
				name: `Experience details for ${experience.id}`,
			}),
		).toBeNull()
	})

	it('opens experience files using cat with a relative path', () => {
		const input = renderBootedTerminal()
		const experience = portfolio.experience[0]
		runTextCommand(
			input,
			`cat ~/experiences/${experience.id.toUpperCase()}`,
		)
		expect(screen.getByText(experience.summary)).toBeTruthy()
		expect(
			screen.getByRole('button', {
				name: `Collapse ${experience.id}: ${experience.desc}`,
			}),
		).toBeTruthy()
	})

	it('keeps repeated experience lists independent and resets disclosures on clear', () => {
		const input = renderBootedTerminal()
		const experience = portfolio.experience[0]
		runTextCommand(input, `cat experiences/${experience.id}`)
		runTextCommand(input, 'ls experiences')
		expect(
			screen.getAllByRole('region', {
				name: `Experience details for ${experience.id}`,
			}),
		).toHaveLength(1)
		expect(
			screen.getAllByRole('button', {
				name: `Expand ${experience.id}: ${experience.desc}`,
			}),
		).toHaveLength(2)
		runTextCommand(input, 'clear')
		expect(
			screen.getAllByRole('list', { name: 'Experience files' }),
		).toHaveLength(1)
		expect(
			screen.queryByRole('region', {
				name: `Experience details for ${experience.id}`,
			}),
		).toBeNull()
	})
	it('returns only social links for socials and the former contact commands', () => {
		for (const command of [
			'socials',
			'cat socials.txt',
			'contact',
			'cat contact.txt',
		]) {
			const result = runPortfolioCommand(command, portfolio, 'test')
			expect(result.lines).toEqual([
				{
					id: 'test:socials',
					kind: 'socials',
					blockId: 'test',
					links: portfolio.socials,
				},
				{ id: 'test:spacer', kind: 'spacer', blockId: 'test' },
			])
		}
	})

	it('removes focus from startup, shortcuts, files and help', () => {
		const input = renderBootedTerminal()
		expect(
			screen.queryByRole('button', { name: 'Run cat focus.txt' }),
		).toBeNull()
		expect(screen.queryByText('cat focus.txt')).toBeNull()
		runTextCommand(input, 'help')
		expect(
			screen.getByRole('region', { name: 'Terminal output' }).textContent,
		).not.toContain('focus.txt')
		const result = runPortfolioCommand('cat focus.txt', portfolio, 'test')
		expect(result.lines[0]).toMatchObject({ kind: 'error' })
	})
})

function renderBootedTerminal(options: { projects?: boolean } = {}) {
	render(<TerminalPortfolio />)
	flushTimers()
	const input = screen.getByRole('textbox', {
		name: 'Terminal command',
	})

	if (!(input instanceof HTMLInputElement)) {
		throw new TypeError('Expected terminal command control to be an input')
	}

	if (options.projects) runTextCommand(input, 'ls projects')
	return input
}

function runTextCommand(
	input: HTMLInputElement,
	command: string,
	options: { flush?: boolean } = {},
) {
	fireEvent.change(input, { target: { value: command } })
	fireEvent.submit(input.closest('form')!)
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
