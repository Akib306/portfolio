import type { Portfolio, Project } from '#/types'

import { CaseStudyInLine } from './CaseStudyInLine'

type ProjectListProps = {
	portfolio: Portfolio
	projectIds: ReadonlyArray<Project['id']>
	blockId: string
	cursorProjectId?: Project['id']
	isProjectOpen: (blockId: string, projectId: Project['id']) => boolean
	onToggleProject: (blockId: string, projectId: Project['id']) => void
}

export function ProjectList({
	portfolio,
	projectIds,
	blockId,
	cursorProjectId,
	isProjectOpen,
	onToggleProject,
}: ProjectListProps) {
	const projects = projectIds
		.map((projectId) =>
			portfolio.projects.find((project) => project.id === projectId),
		)
		.filter((project): project is Project => Boolean(project))

	return (
		<div
			className="mt-1 flex flex-col gap-px"
			role="list"
			aria-label="Project files"
		>
			{projects.map((project) => {
				const open = isProjectOpen(blockId, project.id)
				const selected = project.id === cursorProjectId
				const caseStudyId = `${blockId}-${project.id}-case`

				return (
					<div key={project.id} role="listitem">
						<button
							type="button"
							aria-expanded={open}
							aria-controls={caseStudyId}
							aria-label={`${open ? 'Collapse' : 'Expand'} ${project.id}: ${project.desc}`}
							onClick={() => onToggleProject(blockId, project.id)}
							className={[
								'terminal-project-row grid w-full cursor-pointer grid-cols-[18px_minmax(0,1fr)_auto] gap-x-3 gap-y-1 border-0 border-l-2 px-2 py-2 text-left font-[inherit] text-[inherit] text-terminal-text transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-terminal-blue',
								open
									? 'border-l-terminal-blue bg-terminal-blue/10'
									: 'border-l-transparent',
								!open && selected
									? 'terminal-project-row-selected'
									: '',
							].join(' ')}
						>
							<span
								aria-hidden="true"
								className={[
									'text-center font-bold text-terminal-blue transition-transform',
									open ? 'rotate-90' : 'rotate-0',
								].join(' ')}
							>
								›
							</span>
							<span className="break-all text-terminal-yellow">
								{project.id}
							</span>
							<span className="text-[11px] text-terminal-muted">
								{open ? '[ close ]' : '[ open ]'}
							</span>
							<span className="col-span-2 col-start-2 text-terminal-text-bright">
								{project.desc}
							</span>
							<span className="col-span-2 col-start-2 text-xs text-terminal-muted">
								{project.year} · {project.status}
							</span>
						</button>
						<div
							id={caseStudyId}
							role="region"
							aria-label={`Case study for ${project.id}`}
							hidden={!open}
						>
							{open ? (
								<CaseStudyInLine project={project} />
							) : null}
						</div>
					</div>
				)
			})}
		</div>
	)
}
