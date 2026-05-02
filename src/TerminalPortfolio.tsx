import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { TerminalLine } from '#/components/TerminalLine'
import { portfolio } from '#/data/portfolio'
import type { Project, TerminalLine as TerminalLineModel } from '#/types'

import { runPortfolioCommand } from './commands'

const COMMAND_CHIPS = [
	{ label: 'ls', command: 'ls' },
	{ label: 'whoami', command: 'whoami' },
	{ label: 'contact', command: 'contact' },
	{ label: 'help', command: 'help' },
	{ label: 'clear', command: 'clear' },
] as const

type OpenProjectMap = Record<string, boolean>

export function TerminalPortfolio() {
	const [lines, setLines] = useState<ReadonlyArray<TerminalLineModel>>([])
	const [input, setInput] = useState('')
	const [booted, setBooted] = useState(false)
	const [openProjects, setOpenProjects] = useState<OpenProjectMap>({})
	const [cursorIndex, setCursorIndex] = useState(0)
	const [activeListBlockId, setActiveListBlockId] = useState('')
	const [activeProjectIds, setActiveProjectIds] = useState<
		ReadonlyArray<Project['id']>
	>([])

	const scrollRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const blockCounterRef = useRef(0)
	const bootRunRef = useRef(0)
	const bootTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([])
	const scrollFrameRef = useRef<number | null>(null)

	const makeBlockId = useCallback((prefix: string) => {
		blockCounterRef.current += 1
		return `${prefix}-${blockCounterRef.current}`
	}, [])

	const clearBootTimers = useCallback(() => {
		bootTimersRef.current.forEach((timer) => clearTimeout(timer))
		bootTimersRef.current = []
	}, [])

	const startBoot = useCallback(() => {
		clearBootTimers()

		const bootRunId = bootRunRef.current + 1
		bootRunRef.current = bootRunId
		const bootBlockId = makeBlockId('boot')
		const bootLines = createBootLines(bootBlockId)

		setLines([])
		setInput('')
		setOpenProjects({})
		setBooted(false)
		setCursorIndex(0)
		setActiveListBlockId(bootBlockId)
		setActiveProjectIds(portfolio.projects.map((project) => project.id))

		const tick = (index: number) => {
			if (bootRunRef.current !== bootRunId) {
				return
			}

			if (index >= bootLines.length) {
				setBooted(true)
				return
			}

			setLines((current) => [...current, bootLines[index]])

			const timer = setTimeout(
				() => tick(index + 1),
				index < 2 ? 220 : 320,
			)
			bootTimersRef.current.push(timer)
		}

		const timer = setTimeout(() => tick(0), 220)
		bootTimersRef.current.push(timer)
	}, [clearBootTimers, makeBlockId])

	useEffect(() => {
		startBoot()
		return () => {
			bootRunRef.current += 1
			clearBootTimers()
		}
	}, [clearBootTimers, startBoot])

	useEffect(() => {
		if (scrollFrameRef.current !== null) {
			cancelAnimationFrame(scrollFrameRef.current)
		}

		scrollFrameRef.current = requestAnimationFrame(() => {
			if (!scrollRef.current) {
				return
			}

			scrollRef.current.scrollTop = scrollRef.current.scrollHeight
			scrollFrameRef.current = null
		})

		return () => {
			if (scrollFrameRef.current !== null) {
				cancelAnimationFrame(scrollFrameRef.current)
				scrollFrameRef.current = null
			}
		}
	}, [booted, lines, openProjects])

	useEffect(() => {
		if (booted) {
			inputRef.current?.focus()
		}
	}, [booted])

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
			if (!booted) {
				return
			}

			const blockId = makeBlockId('cmd')
			const promptLine: TerminalLineModel = {
				id: `${blockId}:prompt`,
				kind: 'prompt',
				command,
				blockId,
			}
			const result = runPortfolioCommand(command, portfolio, blockId)

			if (result.shouldClear) {
				startBoot()
				return
			}

			setLines((current) => [...current, promptLine, ...result.lines])

			const listLine = result.lines.find((line) => line.kind === 'list')
			if (listLine?.kind === 'list') {
				setActiveListBlockId(listLine.blockId ?? blockId)
				setActiveProjectIds(listLine.projectIds)
				setCursorIndex(0)
			}

			if (result.openProjectId) {
				const openProjectId = result.openProjectId
				setOpenProjects((current) => ({
					...current,
					[getOpenProjectKey(blockId, openProjectId)]: true,
				}))
			}
		},
		[booted, makeBlockId, startBoot],
	)

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				runCommand(input)
				setInput('')
				return
			}

			if (event.key === 'ArrowUp') {
				event.preventDefault()
				if (activeProjectIds.length === 0) {
					return
				}
				setCursorIndex((current) => Math.max(0, current - 1))
				return
			}

			if (event.key === 'ArrowDown') {
				event.preventDefault()
				if (activeProjectIds.length === 0) {
					return
				}
				setCursorIndex((current) =>
					Math.min(activeProjectIds.length - 1, current + 1),
				)
				return
			}

			if (event.key === 'Tab' && activeListBlockId && cursorProjectId) {
				event.preventDefault()
				toggleProject(activeListBlockId, cursorProjectId)
			}
		},
		[
			activeListBlockId,
			activeProjectIds.length,
			cursorProjectId,
			input,
			runCommand,
			toggleProject,
		],
	)

	const renderedLines = useMemo(
		() =>
			lines.map((line) => (
				<TerminalLine
					key={line.id}
					line={line}
					portfolio={portfolio}
					cursorProjectId={
						line.blockId === activeListBlockId ? cursorProjectId : undefined
					}
					isProjectOpen={isProjectOpen}
					onToggleProject={toggleProject}
				/>
			)),
		[activeListBlockId, cursorProjectId, isProjectOpen, lines, toggleProject],
	)

	return (
		<main
			className="terminal-frame relative flex h-dvh min-h-[640px] cursor-text flex-col overflow-hidden bg-terminal-bg font-mono text-[13px] leading-relaxed text-terminal-text"
			onClick={() => inputRef.current?.focus()}
		>
			<div className="terminal-crt-scan" />
			<div className="terminal-crt-vignette" />

			<div className="relative z-[3] flex items-center gap-2 border-b border-terminal-border-strong bg-terminal-panel px-3.5 py-2.5 text-[11px] text-terminal-muted">
				<span className="h-[11px] w-[11px] rounded-full bg-terminal-red" />
				<span className="h-[11px] w-[11px] rounded-full bg-terminal-yellow" />
				<span className="h-[11px] w-[11px] rounded-full bg-terminal-green" />
				<span>{portfolio.handle} — tty0</span>
				<span className="flex-1" />
				<span>200 OK</span>
			</div>

			<div
				ref={scrollRef}
				className="terminal-scroll relative z-[3] flex-1 overflow-auto px-4 py-[18px] sm:px-[22px]"
			>
				{renderedLines}

				{booted ? (
					<div className="mt-3.5 flex items-center gap-1.5">
						<label htmlFor="terminal-command" className="sr-only">
							Terminal command
						</label>
						<span className="text-terminal-green">guest</span>
						<span className="text-terminal-muted">@</span>
						<span className="text-terminal-blue">{portfolio.domain}</span>
						<span className="text-terminal-muted">:</span>
						<span className="text-terminal-purple">~</span>
						<span className="text-terminal-text">$</span>
						<input
							id="terminal-command"
							ref={inputRef}
							autoFocus
							value={input}
							onChange={(event) => setInput(event.target.value)}
							onKeyDown={handleKeyDown}
							className="min-w-0 flex-1 border-0 bg-transparent font-[inherit] text-[inherit] text-terminal-text outline-none placeholder:text-terminal-muted"
							placeholder="type a command"
							autoComplete="off"
							spellCheck={false}
						/>
						<span aria-hidden="true" className="terminal-caret text-terminal-blue">
							▍
						</span>
					</div>
				) : null}

				{booted ? (
					<div className="mt-3 flex flex-wrap gap-1.5">
						{COMMAND_CHIPS.map((chip) => (
							<button
								key={chip.command}
								type="button"
								onClick={(event) => {
									event.stopPropagation()
									runCommand(chip.command)
									setInput('')
								}}
								className="cursor-pointer rounded-[2px] border border-terminal-border bg-terminal-panel px-3 py-1 text-xs font-[inherit] text-terminal-text transition-colors hover:border-terminal-blue/60 hover:text-terminal-text-bright"
							>
								{chip.label}
							</button>
						))}
					</div>
				) : null}
			</div>

			<div className="relative z-[3] flex gap-3 border-t border-terminal-border px-4 py-2 text-[11px] text-terminal-muted">
				<span>↑↓ select · tab toggle · enter run</span>
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
			text: 'click a chip, run a command, or click any project to expand it',
			blockId,
		},
		{ id: `${blockId}:spacer:0`, kind: 'spacer', blockId },
		{
			id: `${blockId}:prompt:whoami`,
			kind: 'prompt',
			command: 'whoami',
			blockId,
		},
		{
			id: `${blockId}:output:role`,
			kind: 'output',
			text: `${portfolio.role}. ${portfolio.blurb}`,
			blockId,
		},
		{
			id: `${blockId}:output:location`,
			kind: 'output',
			text: `loc · ${portfolio.location}  ·  focus · ${portfolio.focus}`,
			blockId,
		},
		{ id: `${blockId}:spacer:1`, kind: 'spacer', blockId },
		{
			id: `${blockId}:prompt:projects`,
			kind: 'prompt',
			command: 'ls /projects',
			blockId,
		},
		{
			id: `${blockId}:list`,
			kind: 'list',
			projectIds: portfolio.projects.map((project) => project.id),
			blockId,
		},
		{ id: `${blockId}:spacer:2`, kind: 'spacer', blockId },
	]
}

function getOpenProjectKey(blockId: string, projectId: Project['id']) {
	return `${blockId}::${projectId}`
}
