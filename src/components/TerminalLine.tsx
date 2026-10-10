import type {
	Portfolio,
	Project,
	TerminalLine as TerminalLineModel,
} from '#/types'

import { AsciiPortrait } from './AsciiPortrait'
import { ExperienceList } from './ExperienceList'
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
		case 'profile':
			return (
				<div className="terminal-profile">
					<AsciiPortrait name={portfolio.name} />
					<div className="terminal-profile-info">
						<div className="flex min-w-0 gap-1.5">
							<span className="text-terminal-green">$</span>
							<CommandText command="whoami" />
						</div>
						<h1 className="terminal-title mt-1 mb-2 text-terminal-text-bright">
							{portfolio.name} · {portfolio.role}
						</h1>
						<div className="terminal-prose text-terminal-text">
							{portfolio.blurb}
						</div>
						<div className="mt-2 flex min-w-0 gap-1.5">
							<span className="text-terminal-green">$</span>
							<CommandText command="cat location.txt" />
						</div>
						<div className="break-words text-terminal-text">
							{portfolio.location}
						</div>
					</div>
				</div>
			)
		case 'spacer':
			return <div className="h-2" />
		case 'system':
			return (
				<div className="terminal-system break-words text-terminal-muted">
					{line.text}
				</div>
			)
		case 'prompt':
			return (
				<div className="flex min-w-0 gap-1.5">
					<span className="text-terminal-green">$</span>
					<CommandText command={line.command} />
				</div>
			)
		case 'output':
			return (
				<div className="terminal-prose text-terminal-text">
					{line.text}
				</div>
			)
		case 'error':
			return (
				<div className="break-words text-terminal-red">{line.text}</div>
			)
		case 'socials':
			return (
				<ul aria-label="Social profiles" className="terminal-prose">
					{line.links.map((link) => (
						<li
							key={link.href}
							className="flex flex-wrap items-baseline gap-x-3"
						>
							<span className="text-terminal-muted">
								{link.label}
							</span>
							<a
								href={link.href}
								target="_blank"
								rel="noreferrer"
								className="terminal-link min-w-0 break-all"
								aria-label={`${link.label} (opens in a new tab)`}
							>
								{link.href}
							</a>
						</li>
					))}
				</ul>
			)
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
		case 'experience-list':
			return (
				<ExperienceList
					portfolio={portfolio}
					experienceIds={line.experienceIds}
					blockId={line.blockId ?? line.id}
					isExperienceOpen={isProjectOpen}
					onToggleExperience={onToggleProject}
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
		<span className="min-w-0 break-words text-terminal-text">
			<span className="text-terminal-blue">{executable}</span>
			{args}
		</span>
	)
}
