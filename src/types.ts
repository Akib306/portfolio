export type ProjectDecision = {
	title: string
	detail: string
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
	links?: ReadonlyArray<PortfolioHighlight>
}

export type Experience = {
	id: string
	size: string
	date: string
	desc: string
	role: string
	organization: string
	status: string
	period: string
	summary: string
	highlights: ReadonlyArray<ProjectDecision>
	links?: ReadonlyArray<PortfolioHighlight>
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
	socials: ReadonlyArray<PortfolioHighlight>
	highlight?: PortfolioHighlight
	projects: ReadonlyArray<Project>
	experience: ReadonlyArray<Experience>
}

export type TerminalLineKind =
	| 'system'
	| 'prompt'
	| 'output'
	| 'error'
	| 'spacer'
	| 'list'
	| 'experience-list'
	| 'socials'

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

export type TerminalExperienceListLine = TerminalLineBase & {
	kind: 'experience-list'
	experienceIds: ReadonlyArray<Experience['id']>
}

export type TerminalSocialsLine = TerminalLineBase & {
	kind: 'socials'
	links: ReadonlyArray<PortfolioHighlight>
}

export type TerminalLine =
	| TerminalTextLine
	| TerminalPromptLine
	| TerminalSpacerLine
	| TerminalProjectListLine
	| TerminalExperienceListLine
	| TerminalSocialsLine

export type CommandName =
	| 'help'
	| 'ls'
	| 'projects'
	| 'experience'
	| 'whoami'
	| 'contact'
	| 'socials'
	| 'clear'
	| 'cat'

export type CommandContext = {
	portfolio: Portfolio
	blockId: string
}

export type CommandResult = {
	lines: ReadonlyArray<TerminalLine>
	openProjectId?: Project['id']
	openExperienceId?: Experience['id']
	shouldClear?: boolean
}
