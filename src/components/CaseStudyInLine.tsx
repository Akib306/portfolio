import type { Project } from '#/types'

type CaseStudyInLineProps = {
	project: Project
}

export function CaseStudyInLine({ project }: CaseStudyInLineProps) {
	return (
		<div className="terminal-case ml-0 mt-1 mb-2 border border-terminal-border border-l-2 border-l-terminal-blue px-4 py-3 sm:ml-7 sm:px-[18px]">
			<div className="font-serif text-[22px] leading-tight font-medium tracking-[-0.2px] text-terminal-text-bright">
				{project.tagline}
			</div>

			<div className="mt-3 grid gap-x-3 gap-y-1 border-b border-terminal-border pb-3 text-[11px] text-terminal-text sm:grid-cols-4">
				<Meta label="role" value={project.role} />
				<Meta label="year" value={project.year} />
				<Meta label="plat" value={project.platform} />
				<Meta label="stat" value={project.status} />
			</div>

			<CaseSection title="// the problem">{project.problem}</CaseSection>
			<CaseSection title="// the insight">{project.insight}</CaseSection>

			<div className="mt-4 mb-1 text-[11px] tracking-[0.04em] text-terminal-purple">
				// design decisions
			</div>
			{project.decisions.map((decision) => (
				<p
					key={decision.title}
					className="my-1 font-serif text-sm leading-relaxed text-terminal-text-soft"
				>
					<b className="text-terminal-purple">{decision.title}.</b>{' '}
					{decision.detail}
				</p>
			))}

			<div className="terminal-case-placeholder mt-3 flex h-[110px] items-center justify-center border border-dashed border-terminal-border text-[11px] text-terminal-muted">
				img · {project.id} hero
			</div>
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
			<p className="my-1 font-serif text-sm leading-relaxed text-terminal-text-soft">
				{children}
			</p>
		</section>
	)
}
