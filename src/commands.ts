import type {
	CommandResult,
	Experience,
	Portfolio,
	Project,
	TerminalLine,
} from '#/types'

const commandLine = (
	blockId: string,
	index: number,
	kind: 'output' | 'error',
	text: string,
): TerminalLine => ({ id: `${blockId}:${kind}:${index}`, kind, text, blockId })
const projectListLine = (
	blockId: string,
	projectIds: ReadonlyArray<Project['id']>,
): TerminalLine => ({
	id: `${blockId}:projects`,
	kind: 'list',
	blockId,
	projectIds,
})
const experienceListLine = (
	blockId: string,
	experienceIds: ReadonlyArray<Experience['id']>,
): TerminalLine => ({
	id: `${blockId}:experience`,
	kind: 'experience-list',
	blockId,
	experienceIds,
})
const spacerLine = (blockId: string): TerminalLine => ({
	id: `${blockId}:spacer`,
	kind: 'spacer',
	blockId,
})

export function getProjectById(portfolio: Portfolio, id: string) {
	return portfolio.projects.find(
		(project) => project.id.toLowerCase() === id.toLowerCase(),
	)
}

export function runPortfolioCommand(
	command: string,
	portfolio: Portfolio,
	blockId: string,
): CommandResult {
	const trimmed = command.trim().replace(/\s+/g, ' ')
	const normalized = trimmed.toLowerCase()
	const output = (...texts: ReadonlyArray<string>): CommandResult => ({
		lines: [
			...texts.map((text, index) =>
				commandLine(blockId, index, 'output', text),
			),
			spacerLine(blockId),
		],
	})
	const error = (text: string): CommandResult => ({
		lines: [commandLine(blockId, 0, 'error', text), spacerLine(blockId)],
	})
	if (!trimmed) return { lines: [] }
	if (normalized === 'clear') return { lines: [], shouldClear: true }
	if (normalized === 'help')
		return output(
			'commands · whoami · ls · ls projects · ls experiences · clear',
			'files · cat projects/<id> · cat experiences/<id> · cat location.txt · cat socials.txt',
			'tip · Enter runs a command; Tab moves between controls; open any row to read details',
			'paths · projects and experiences are directories in ~; use relative paths such as ls projects',
		)
	if (normalized === 'ls' || normalized === 'ls -la')
		return output('projects', 'experiences', 'location.txt', 'socials.txt')
	const lsMatch = normalized.match(/^ls\s+(?:-la\s+)?(.+)$/)
	const directory = lsMatch?.[1]
		.replace(/^(?:\.\/|~\/)/, '')
		.replace(/\/$/, '')
	if (directory === 'projects' || normalized === 'projects')
		return {
			lines: [
				projectListLine(
					blockId,
					portfolio.projects.map((project) => project.id),
				),
				spacerLine(blockId),
			],
		}
	if (
		directory === 'experiences' ||
		directory === 'experience' ||
		normalized === 'experiences' ||
		normalized === 'experience'
	)
		return {
			lines: [
				experienceListLine(
					blockId,
					portfolio.experience.map((experience) => experience.id),
				),
				spacerLine(blockId),
			],
		}
	if (lsMatch)
		return error(
			`ls: cannot access '${lsMatch[1]}' · try ls projects or ls experiences`,
		)
	if (normalized === 'whoami')
		return output(`${portfolio.name} · ${portfolio.role}`, portfolio.blurb)
	if (normalized === 'socials' || normalized === 'contact')
		return {
			lines: [
				{
					id: `${blockId}:socials`,
					kind: 'socials',
					blockId,
					links: portfolio.socials,
				},
				spacerLine(blockId),
			],
		}
	if (normalized === 'cat')
		return error(
			'usage · cat projects/<id> | experiences/<id> | location.txt | socials.txt',
		)
	if (normalized.startsWith('cat ')) {
		const requested = trimmed.slice(4).replace(/^(?:\.\/|~\/)/, '')
		const filename = requested.toLowerCase()
		if (filename === 'location.txt') return output(portfolio.location)
		if (filename === 'socials.txt' || filename === 'contact.txt')
			return runPortfolioCommand('socials', portfolio, blockId)
		const projectId = requested.replace(/^projects\//i, '')
		const project = getProjectById(portfolio, projectId)
		if (project)
			return {
				lines: [
					projectListLine(blockId, [project.id]),
					spacerLine(blockId),
				],
				openProjectId: project.id,
			}
		const experienceId = requested
			.replace(/^experiences\//i, '')
			.toLowerCase()
		const experience = portfolio.experience.find(
			(item) => item.id.toLowerCase() === experienceId,
		)
		if (experience)
			return {
				lines: [
					experienceListLine(blockId, [experience.id]),
					spacerLine(blockId),
				],
				openExperienceId: experience.id,
			}
		return error(
			`cat: ${requested}: no such file · try ls projects or ls experiences`,
		)
	}
	return error(`command not found: ${normalized} · try help`)
}
