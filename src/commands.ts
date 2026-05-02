import type { CommandResult, Portfolio, Project, TerminalLine } from '#/types'

const commandLine = (
	blockId: string,
	index: number,
	kind: 'output' | 'error',
	text: string,
): TerminalLine => ({
	id: `${blockId}:${kind}:${index}`,
	kind,
	text,
	blockId,
})

const projectListLine = (
	blockId: string,
	projectIds: ReadonlyArray<Project['id']>,
): TerminalLine => ({
	id: `${blockId}:projects`,
	kind: 'list',
	blockId,
	projectIds,
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
	const trimmed = command.trim()
	const normalized = trimmed.toLowerCase()

	if (!trimmed) {
		return { lines: [] }
	}

	if (normalized === 'clear') {
		return { lines: [], shouldClear: true }
	}

	if (normalized === 'help') {
		return {
			lines: [
				commandLine(
					blockId,
					0,
					'output',
					'commands · whoami · ls · projects · cat <project-id> · contact · clear',
				),
				commandLine(
					blockId,
					1,
					'output',
					'tip · click a project row or use tab to toggle its case study',
				),
				spacerLine(blockId),
			],
		}
	}

	if (normalized === 'ls' || normalized === 'ls -la' || normalized === 'projects') {
		return {
			lines: [
				projectListLine(
					blockId,
					portfolio.projects.map((project) => project.id),
				),
				spacerLine(blockId),
			],
		}
	}

	if (normalized === 'whoami') {
		return {
			lines: [
				commandLine(blockId, 0, 'output', `${portfolio.role}. ${portfolio.blurb}`),
				commandLine(
					blockId,
					1,
					'output',
					`loc · ${portfolio.location}  ·  focus · ${portfolio.focus}`,
				),
				spacerLine(blockId),
			],
		}
	}

	if (normalized === 'contact') {
		return {
			lines: [
				commandLine(blockId, 0, 'output', `mail · ${portfolio.contact}`),
				commandLine(blockId, 1, 'output', `site · ${portfolio.domain}`),
				spacerLine(blockId),
			],
		}
	}

	if (normalized.startsWith('cat ')) {
		const requestedId = trimmed.slice(4).trim()
		const project = getProjectById(portfolio, requestedId)

		if (!project) {
			return {
				lines: [
					commandLine(blockId, 0, 'error', 'no such project · try ls'),
					spacerLine(blockId),
				],
			}
		}

		return {
			lines: [projectListLine(blockId, [project.id]), spacerLine(blockId)],
			openProjectId: project.id,
		}
	}

	return {
		lines: [
			commandLine(
				blockId,
				0,
				'error',
				`command not found: ${normalized} · try help`,
			),
			spacerLine(blockId),
		],
	}
}
