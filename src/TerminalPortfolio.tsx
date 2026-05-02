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
	const bootTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([])

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

		const bootBlockId = makeBlockId('boot')
		const bootLines = createBootLines(bootBlockId)

		setLines([])
		setOpenProjects({})
		setBooted(false)
		setCursorIndex(0)
		setActiveListBlockId(bootBlockId)
		setActiveProjectIds(portfolio.projects.map((project) => project.id))

		const tick = (index: number) => {
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
		return clearBootTimers
	}, [clearBootTimers, startBoot])

	useEffect(() => {
		if (!scrollRef.current) {
			return
		}

		scrollRef.current.scrollTop = scrollRef.current.scrollHeight
	}, [lines, openProjects])

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
				setActiveListBlockId(blockId)
				setActiveProjectIds(listLine.projectIds)
				setCursorIndex(0)
			}

			if (result.openProjectId) {
				setOpenProjects((current) => ({
					...current,
					[getOpenProjectKey(blockId, result.openProjectId!)]: true,
				}))
			}
		},
		[makeBlockId, startBoot],
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
				setCursorIndex((current) => Math.max(0, current - 1))
				return
			}

			if (event.key === 'ArrowDown') {
				event.preventDefault()
				setCursorIndex((current) =>
					Math.min(activeProjectIds.length - 1, current + 1),
				)
				return
			}

			if (event.key === 'Tab' && cursorProjectId) {
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
			className="terminal-frame relative flex h-dvh min-h-[640px] cursor-text flex-col overflow-hidden bg-[#1a1d23] font-mono text-[13px] leading-relaxed text-[#abb2bf]"
			onClick={() => inputRef.current?.focus()}
		>
			<div className="terminal-crt-scan" />
			<div className="terminal-crt-vignette" />

			<div className="relative z-[3] flex items-center gap-2 border-b border-[#181a1f] bg-[#21252b] px-3.5 py-2.5 text-[11px] text-[#5c6370]">
				<span className="h-[11px] w-[11px] rounded-full bg-[#e06c75]" />
				<span className="h-[11px] w-[11px] rounded-full bg-[#e5c07b]" />
				<span className="h-[11px] w-[11px] rounded-full bg-[#98c379]" />
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
						<span className="text-[#98c379]">guest</span>
						<span className="text-[#5c6370]">@</span>
						<span className="text-[#61afef]">{portfolio.domain}</span>
						<span className="text-[#5c6370]">:</span>
						<span className="text-[#c678dd]">~</span>
						<span className="text-[#abb2bf]">$</span>
						<input
							id="terminal-command"
							ref={inputRef}
							autoFocus
							value={input}
							onChange={(event) => setInput(event.target.value)}
							onKeyDown={handleKeyDown}
							className="min-w-0 flex-1 border-0 bg-transparent font-[inherit] text-[inherit] text-[#abb2bf] outline-none placeholder:text-[#5c6370]"
							placeholder="type a command"
							autoComplete="off"
							spellCheck={false}
						/>
						<span aria-hidden="true" className="terminal-caret text-[#61afef]">
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
								}}
								className="cursor-pointer rounded-[2px] border border-[#2a2f37] bg-[#21252b] px-3 py-1 text-xs font-[inherit] text-[#abb2bf] transition-colors hover:border-[#61afef]/60 hover:text-[#dcdfe4]"
							>
								{chip.label}
							</button>
						))}
					</div>
				) : null}
			</div>

			<div className="relative z-[3] flex gap-3 border-t border-[#2a2f37] px-4 py-2 text-[11px] text-[#5c6370]">
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
