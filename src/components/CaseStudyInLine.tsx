import type { Project } from '#/types'

type CaseStudyInLineProps = {
	project: Project
}

export function CaseStudyInLine({ project }: CaseStudyInLineProps) {
	return (
		<div className="terminal-case ml-0 mt-1 mb-2 break-words border border-terminal-border px-4 py-3 sm:ml-7">
			<h2 className="text-base font-medium text-terminal-text-bright">
				{project.tagline}
			</h2>

			<div className="mt-3 grid gap-x-3 gap-y-1 border-b border-terminal-border pb-3 text-[11px] text-terminal-text sm:grid-cols-4">
				<Meta label="role" value={project.role} />
				<Meta label="year" value={project.year} />
				<Meta label="platform" value={project.platform} />
				<Meta label="status" value={project.status} />
			</div>
			{project.links?.length ? (
				<div className="mt-3 flex flex-wrap gap-2 text-xs">
					{project.links.map((link) => (
						<a
							key={link.href}
							href={link.href}
							target="_blank"
							rel="noreferrer"
							className="terminal-link"
							aria-label={`${project.id}: ${link.label} (opens in a new tab)`}
						>
							{link.label} ↗
						</a>
					))}
				</div>
			) : null}

			<CaseSection title="// the problem">{project.problem}</CaseSection>
			<CaseSection title="// the insight">{project.insight}</CaseSection>

			<div className="mt-4 mb-1 text-[11px] tracking-[0.04em] text-terminal-purple">
				// project highlights
			</div>
			{project.decisions.map((decision) => (
				<p
					key={decision.title}
					className="my-1 max-w-[120ch] text-sm leading-relaxed text-terminal-text-soft"
				>
					<b className="text-terminal-purple">{decision.title}.</b>{' '}
					{decision.detail}
				</p>
			))}
		</div>
	)
}

function Meta({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<span className="mb-0.5 block tracking-[0.04em] text-terminal-muted">
				{label}
			</span>
			<span>{value}</span>
		</div>
	)
}

function CaseSection({
	title,
	children,
}: {
	title: string
	children: React.ReactNode
}) {
	return (
		<section>
			<div className="mt-4 mb-1 text-[11px] tracking-[0.04em] text-terminal-purple">
				{title}
			</div>
			<p className="my-1 max-w-[120ch] text-sm leading-relaxed text-terminal-text-soft">
				{children}
			</p>
		</section>
	)
}
