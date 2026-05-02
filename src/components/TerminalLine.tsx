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
			return <div className="text-[#5c6370]">{line.text}</div>
		case 'prompt':
			return (
				<div className="flex gap-1.5">
					<span className="text-[#98c379]">$</span>
					<span className="text-[#abb2bf]">{line.command}</span>
				</div>
			)
		case 'output':
			return <div className="text-[#abb2bf]">{line.text}</div>
		case 'error':
			return <div className="text-[#e06c75]">{line.text}</div>
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
