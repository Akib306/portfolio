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
		<div className="mt-1 flex flex-col gap-px">
			<div className="hidden border-b border-terminal-border px-2 py-1 text-[10px] tracking-[0.12em] text-terminal-muted sm:grid sm:grid-cols-[18px_180px_70px_90px_auto] sm:gap-3">
				<span />
				<span>NAME</span>
				<span>SIZE</span>
				<span>MODIFIED</span>
				<span />
			</div>

			{projects.map((project) => {
				const open = isProjectOpen(blockId, project.id)
				const selected = project.id === cursorProjectId

				return (
					<div key={project.id}>
						<button
							type="button"
							aria-expanded={open}
							aria-controls={`${blockId}-${project.id}-case`}
							onClick={() => onToggleProject(blockId, project.id)}
							className={[
								'terminal-project-row grid w-full cursor-pointer grid-cols-[18px_minmax(0,1fr)_auto] gap-x-3 gap-y-1 border-0 border-l-2 px-2 py-2 text-left font-[inherit] text-[inherit] text-terminal-text transition-colors sm:grid-cols-[18px_180px_70px_90px_auto] sm:items-center',
								open
									? 'border-l-terminal-blue bg-terminal-blue/10'
									: 'border-l-transparent',
								!open && selected ? 'terminal-project-row-selected' : '',
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
							<span className="truncate text-terminal-yellow">{project.id}</span>
							<span className="justify-self-end text-[11px] text-terminal-muted sm:justify-self-auto">
								{open ? '[ close ]' : '[ open ]'}
							</span>
							<span className="col-start-2 text-terminal-muted sm:col-start-auto">
								{project.size}
							</span>
							<span className="text-terminal-muted">{project.date}</span>
						</button>
						{open ? (
							<div id={`${blockId}-${project.id}-case`}>
								<CaseStudyInLine project={project} />
							</div>
						) : null}
					</div>
				)
			})}
		</div>
	)
}
