export type ProjectDecision = {
	title: string
	detail: string
}

export type ProjectLink = {
	label: string
	href: string
}

export type Project = {
	id: string
	size: string
	date: string
	desc: string
	role: string
	status: string
	tagline: string
	year: string
	platform: string
	problem: string
	insight: string
	decisions: ReadonlyArray<ProjectDecision>
	coverImage?: string
	coverAlt?: string
	links?: ReadonlyArray<ProjectLink>
}

export type PortfolioHighlight = {
	label: string
	href: string
}

export type Portfolio = {
	name: string
	handle: string
	domain: string
	role: string
	blurb: string
	location: string
	focus: string
	contact: string
	highlight?: PortfolioHighlight
	projects: ReadonlyArray<Project>
}

export type TerminalLineKind =
	| 'system'
	| 'prompt'
	| 'output'
	| 'error'
	| 'spacer'
	| 'list'

export type TerminalLineBase = {
	id: string
	kind: TerminalLineKind
	blockId?: string
}

export type TerminalTextLine = TerminalLineBase & {
	kind: 'system' | 'output' | 'error'
	text: string
}

export type TerminalPromptLine = TerminalLineBase & {
	kind: 'prompt'
	command: string
}

export type TerminalSpacerLine = TerminalLineBase & {
	kind: 'spacer'
}

export type TerminalProjectListLine = TerminalLineBase & {
	kind: 'list'
	projectIds: ReadonlyArray<Project['id']>
}

export type TerminalLine =
	| TerminalTextLine
	| TerminalPromptLine
	| TerminalSpacerLine
	| TerminalProjectListLine

export type CommandName =
	| 'help'
	| 'ls'
	| 'projects'
	| 'whoami'
	| 'contact'
	| 'clear'
	| 'cat'

export type CommandContext = {
	portfolio: Portfolio
	blockId: string
}

export type CommandResult = {
	lines: ReadonlyArray<TerminalLine>
	openProjectId?: Project['id']
	shouldClear?: boolean
}
