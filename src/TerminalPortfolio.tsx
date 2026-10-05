import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { TerminalLine } from '#/components/TerminalLine'
import { portfolio } from '#/data/portfolio'
import type { Project, TerminalLine as TerminalLineModel } from '#/types'

import { runPortfolioCommand } from './commands'

const COMMAND_CHIPS = [
	{ label: 'experiences', command: 'ls experiences' },
	{ label: 'projects', command: 'ls projects' },
	{ label: 'whoami', command: 'whoami' },
	{ label: 'location', command: 'cat location.txt' },
	{ label: 'socials', command: 'socials' },
	{ label: 'help', command: 'help' },
	{ label: 'clear', command: 'clear' },
] as const

type OpenProjectMap = Record<string, boolean>

export function TerminalPortfolio() {
	const [lines, setLines] = useState<ReadonlyArray<TerminalLineModel>>(() =>
		createBootLines('boot-0'),
	)
	const [input, setInput] = useState('')
	const [openProjects, setOpenProjects] = useState<OpenProjectMap>({})
	const [cursorIndex, setCursorIndex] = useState(0)
	const [activeListBlockId, setActiveListBlockId] = useState('')
	const [activeProjectIds, setActiveProjectIds] = useState<
		ReadonlyArray<Project['id']>
	>([])

	const shortcutsRef = useRef<HTMLDivElement>(null)
	const [shortcutScroll, setShortcutScroll] = useState(0)
	const [shortcutsOverflow, setShortcutsOverflow] = useState(false)
	const scrollRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const blockCounterRef = useRef(0)
	const followOutputRef = useRef(false)
	const [announcement, setAnnouncement] = useState('')
	const [showLatest, setShowLatest] = useState(false)
	const [replayBlockId, setReplayBlockId] = useState('')

	const makeBlockId = useCallback((prefix: string) => {
		blockCounterRef.current += 1
		return `${prefix}-${blockCounterRef.current}`
	}, [])

	useEffect(() => {
		if (!followOutputRef.current) return
		const frame = requestAnimationFrame(() => {
			if (scrollRef.current) {
				scrollRef.current.scrollTop = scrollRef.current.scrollHeight
			}
		})
		return () => cancelAnimationFrame(frame)
	}, [lines])

	useEffect(() => {
		const shortcuts = shortcutsRef.current
		if (!shortcuts) return
		const measure = () => {
			const maxScroll = shortcuts.scrollWidth - shortcuts.clientWidth
			setShortcutsOverflow(maxScroll > 1)
			setShortcutScroll(
				maxScroll > 0 ? (shortcuts.scrollLeft / maxScroll) * 100 : 0,
			)
		}
		measure()
		const observer =
			typeof ResizeObserver === 'undefined'
				? undefined
				: new ResizeObserver(measure)
		observer?.observe(shortcuts)
		window.addEventListener('resize', measure)
		return () => {
			observer?.disconnect()
			window.removeEventListener('resize', measure)
		}
	}, [])

	const cursorProjectId = activeProjectIds[cursorIndex]

	const isProjectOpen = useCallback(
		(blockId: string, projectId: Project['id']) =>
			Boolean(openProjects[getOpenProjectKey(blockId, projectId)]),
		[openProjects],
	)

	const toggleProject = useCallback(
		(blockId: string, projectId: Project['id']) => {
			setOpenProjects((current) => {
				const key = getOpenProjectKey(blockId, projectId)
				return { ...current, [key]: !current[key] }
			})
		},
		[],
	)

	const runCommand = useCallback(
		(command: string) => {
			if (!command.trim()) {
				return
			}
			const output = scrollRef.current
			followOutputRef.current = Boolean(
				output &&
				output.scrollHeight - output.scrollTop - output.clientHeight <
					80,
			)

			const blockId = makeBlockId('cmd')
			const promptLine: TerminalLineModel = {
				id: `${blockId}:prompt`,
				kind: 'prompt',
				command,
				blockId,
			}
			const result = runPortfolioCommand(command, portfolio, blockId)

			if (result.shouldClear) {
				const bootBlockId = makeBlockId('boot')
				followOutputRef.current = false
				if (scrollRef.current) scrollRef.current.scrollTop = 0
				setLines(createBootLines(bootBlockId))
				setOpenProjects({})
				setActiveListBlockId('')
				setActiveProjectIds([])
				setReplayBlockId(bootBlockId)
				setCursorIndex(0)
				setAnnouncement(
					'Session reset. Portrait, introduction and experiences restored.',
				)
				setShowLatest(false)
				return
			}
			setShowLatest(!followOutputRef.current)
			setAnnouncement(
				`${command.trim()} completed. Read the terminal output.`,
			)

			setLines((current) => [...current, promptLine, ...result.lines])

			const listLine = result.lines.find((line) => line.kind === 'list')
			if (listLine?.kind === 'list') {
				setActiveListBlockId(listLine.blockId ?? blockId)
				setActiveProjectIds(listLine.projectIds)
				setCursorIndex(0)
			} else {
				setActiveListBlockId('')
				setActiveProjectIds([])
				setCursorIndex(0)
			}

			if (result.openProjectId) {
				const openProjectId = result.openProjectId
				setOpenProjects((current) => ({
					...current,
					[getOpenProjectKey(blockId, openProjectId)]: true,
				}))
			}
			if (result.openExperienceId) {
				const experienceId = result.openExperienceId
				setOpenProjects((current) => ({
					...current,
					[getOpenProjectKey(blockId, experienceId)]: true,
				}))
			}
		},
		[makeBlockId],
	)

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.nativeEvent.isComposing) return

			if (event.altKey && event.key === 'ArrowUp') {
				event.preventDefault()
				if (activeProjectIds.length === 0) {
					return
				}
				setCursorIndex((current) => Math.max(0, current - 1))
				return
			}

			if (event.altKey && event.key === 'ArrowDown') {
				event.preventDefault()
				if (activeProjectIds.length === 0) {
					return
				}
				setCursorIndex((current) =>
					Math.min(activeProjectIds.length - 1, current + 1),
				)
				return
			}

			if (
				event.altKey &&
				event.key === 'ArrowRight' &&
				activeListBlockId &&
				cursorProjectId
			) {
				event.preventDefault()
				toggleProject(activeListBlockId, cursorProjectId)
			}
		},
		[
			activeListBlockId,
			activeProjectIds.length,
			cursorProjectId,
			toggleProject,
		],
	)

	const renderedLines = useMemo(
		() =>
			lines.map((line, index) => (
				<div
					key={line.id}
					className={
						line.blockId === replayBlockId
							? 'terminal-boot-line'
							: undefined
					}
					style={
						line.blockId === replayBlockId
							? { animationDelay: `${index * 60}ms` }
							: undefined
					}
				>
					<TerminalLine
						line={line}
						portfolio={portfolio}
						cursorProjectId={
							line.blockId === activeListBlockId
								? cursorProjectId
								: undefined
						}
						isProjectOpen={isProjectOpen}
						onToggleProject={toggleProject}
					/>
				</div>
			)),
		[
			activeListBlockId,
			cursorProjectId,
			isProjectOpen,
			lines,
			replayBlockId,
			toggleProject,
		],
	)

	return (
		<main
			className="terminal-frame relative flex h-dvh min-h-[240px] flex-col overflow-hidden bg-terminal-bg text-terminal-text"
			aria-label="Interactive terminal portfolio"
		>
			<div className="terminal-crt-scan" aria-hidden="true" />
			<div className="terminal-crt-vignette" aria-hidden="true" />

			<div className="terminal-meta relative z-[3] flex flex-wrap items-center gap-2 border-b border-terminal-border-strong bg-terminal-panel px-3.5 py-2.5 text-terminal-muted">
				<span
					className="h-[11px] w-[11px] rounded-full bg-terminal-red"
					aria-hidden="true"
				/>
				<span
					className="h-[11px] w-[11px] rounded-full bg-terminal-yellow"
					aria-hidden="true"
				/>
				<span
					className="h-[11px] w-[11px] rounded-full bg-terminal-green"
					aria-hidden="true"
				/>
				<span className="min-w-0 truncate">
					{portfolio.handle} — tty0
				</span>
				<span className="flex-1" />
				<span role="status" aria-label="Terminal status">
					~
				</span>
			</div>
			<h1 className="sr-only">{portfolio.name}</h1>

			<div
				ref={scrollRef}
				className="terminal-scroll relative z-[3] min-h-0 flex-1 overflow-auto overflow-x-hidden px-3 py-4 sm:px-[22px] sm:py-[18px]"
				role="region"
				aria-label="Terminal output"
				onScroll={(event) => {
					const output = event.currentTarget
					if (
						output.scrollHeight -
							output.scrollTop -
							output.clientHeight <
						80
					)
						setShowLatest(false)
				}}
			>
				{renderedLines}
			</div>
			<div className="relative z-[3] shrink-0 border-t border-terminal-border bg-terminal-bg px-3 pb-3 sm:px-[22px]">
				<form
					className="mt-3 flex flex-wrap items-center gap-1.5"
					onSubmit={(event) => {
						event.preventDefault()
						if (!input.trim()) return
						runCommand(input)
						setInput('')
						inputRef.current?.focus()
					}}
				>
					<label htmlFor="terminal-command" className="sr-only">
						Terminal command
					</label>
					<span
						aria-hidden="true"
						className="hidden items-center gap-1.5 sm:inline-flex"
					>
						<span className="text-terminal-green">guest</span>
						<span className="text-terminal-muted">@</span>
						<span className="text-terminal-blue">
							{portfolio.domain}
						</span>
						<span className="text-terminal-muted">:</span>
						<span className="text-terminal-purple">~</span>
					</span>
					<span className="text-terminal-text">$</span>
					<input
						id="terminal-command"
						ref={inputRef}
						value={input}
						onChange={(event) => setInput(event.target.value)}
						onKeyDown={handleKeyDown}
						className="min-w-0 flex-1 bg-transparent px-1 py-2 font-[inherit] text-base text-terminal-text outline-none placeholder:text-terminal-muted"
						placeholder="type a command"
						autoComplete="off"
						autoCapitalize="none"
						autoCorrect="off"
						enterKeyHint="enter"
						spellCheck={false}
						aria-describedby="terminal-keyboard-help"
					/>
				</form>

				{showLatest ? (
					<button
						type="button"
						className="terminal-chip mt-2"
						onClick={() => {
							if (scrollRef.current)
								scrollRef.current.scrollTop =
									scrollRef.current.scrollHeight
							setShowLatest(false)
						}}
					>
						Show latest output ↓
					</button>
				) : null}
				<div
					ref={shortcutsRef}
					id="terminal-command-shortcuts"
					className="terminal-command-shortcuts mt-3 flex gap-1.5 overflow-x-auto p-1 sm:flex-wrap"
					onScroll={(event) => {
						const shortcuts = event.currentTarget
						const maxScroll =
							shortcuts.scrollWidth - shortcuts.clientWidth
						setShortcutScroll(
							maxScroll > 0
								? (shortcuts.scrollLeft / maxScroll) * 100
								: 0,
						)
					}}
					role="group"
					aria-label="Command shortcuts"
				>
					{COMMAND_CHIPS.map((chip) => (
						<button
							key={chip.command}
							type="button"
							aria-label={`Run ${chip.command}`}
							onClick={(event) => {
								event.stopPropagation()
								runCommand(chip.command)
							}}
							className="terminal-chip"
						>
							{chip.label}
						</button>
					))}
				</div>
				<input
					type="range"
					className="terminal-command-scrollbar sm:hidden"
					aria-label="Scroll command shortcuts"
					aria-controls="terminal-command-shortcuts"
					min={0}
					max={100}
					step="any"
					value={shortcutScroll}
					disabled={!shortcutsOverflow}
					onChange={(event) => {
						const value = Number(event.target.value)
						setShortcutScroll(value)
						const shortcuts = shortcutsRef.current
						if (shortcuts)
							shortcuts.scrollLeft =
								((shortcuts.scrollWidth -
									shortcuts.clientWidth) *
									value) /
								100
					}}
				/>
			</div>
			<p role="status" className="sr-only">
				{announcement}
			</p>

			<div
				id="terminal-keyboard-help"
				className="terminal-meta relative z-[3] flex flex-wrap gap-3 border-t border-terminal-border px-3 py-2 text-terminal-muted sm:px-4"
			>
				<span className="hidden sm:inline">
					Tab navigate · Enter run · Alt+↑↓ select · Alt+→ expand
				</span>
				<span className="sm:hidden">Enter run · swipe shortcuts →</span>
				<span className="flex-1" />
				<span>{portfolio.domain}</span>
			</div>
		</main>
	)
}

function createBootLines(blockId: string): ReadonlyArray<TerminalLineModel> {
	return [
		{
			id: `${blockId}:system:0`,
			kind: 'system',
			text: `tty0 · ${portfolio.handle} · session opened`,
			blockId,
		},
		{
			id: `${blockId}:system:1`,
			kind: 'system',
			text: 'open an experience, or run ls projects to explore my projects',
			blockId,
		},
		{ id: `${blockId}:spacer:0`, kind: 'spacer', blockId },
		{ id: `${blockId}:profile`, kind: 'profile', blockId },
		{ id: `${blockId}:spacer:1`, kind: 'spacer', blockId },
		{
			id: `${blockId}:prompt:experiences`,
			kind: 'prompt',
			command: 'ls experiences',
			blockId,
		},
		{
			id: `${blockId}:list`,
			kind: 'experience-list',
			experienceIds: portfolio.experience.map(
				(experience) => experience.id,
			),
			blockId,
		},
		{ id: `${blockId}:spacer:2`, kind: 'spacer', blockId },
	]
}

function getOpenProjectKey(blockId: string, projectId: Project['id']) {
	return `${blockId}::${projectId}`
}
