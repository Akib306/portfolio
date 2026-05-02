import type {
	Portfolio,
	Project,
	TerminalLine as TerminalLineModel,
} from '#/types'

import { ProjectList } from './ProjectList'

type TerminalLineProps = {
	line: TerminalLineModel
	portfolio: Portfolio
	cursorProjectId?: Project['id']
	isProjectOpen: (blockId: string, projectId: Project['id']) => boolean
	onToggleProject: (blockId: string, projectId: Project['id']) => void
}

export function TerminalLine({
	line,
	portfolio,
	cursorProjectId,
	isProjectOpen,
	onToggleProject,
}: TerminalLineProps) {
	switch (line.kind) {
		case 'spacer':
			return <div className="h-2" />
		case 'system':
			return <div className="text-terminal-muted">{line.text}</div>
		case 'prompt':
			return (
				<div className="flex gap-1.5">
					<span className="text-terminal-green">$</span>
					<CommandText command={line.command} />
				</div>
			)
		case 'output':
			return <div className="text-terminal-text">{line.text}</div>
		case 'error':
			return <div className="text-terminal-red">{line.text}</div>
		case 'list':
			return (
				<ProjectList
					portfolio={portfolio}
					projectIds={line.projectIds}
					blockId={line.blockId ?? line.id}
					cursorProjectId={cursorProjectId}
					isProjectOpen={isProjectOpen}
					onToggleProject={onToggleProject}
				/>
			)
	}
}

function CommandText({ command }: { command: string }) {
	const match = command.match(/^(\S+)(.*)$/)

	if (!match) {
		return null
	}

	const [, executable, args] = match

	return (
		<span className="text-terminal-text">
			<span className="text-terminal-blue">{executable}</span>
			{args}
		</span>
	)
}
