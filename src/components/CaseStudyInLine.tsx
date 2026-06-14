import type { Project } from '#/types'

type CaseStudyInLineProps = {
	project: Project
}

export function CaseStudyInLine({ project }: CaseStudyInLineProps) {
	return (
		<div className="terminal-case ml-0 mt-1 mb-2 break-words border border-terminal-border border-l-2 border-l-terminal-blue px-4 py-3 sm:ml-7 sm:px-[18px]">
			<h2 className="font-serif text-[20px] leading-tight font-medium tracking-[-0.2px] text-terminal-text-bright sm:text-[22px]">
				{project.tagline}
			</h2>

			<div className="mt-3 grid gap-x-3 gap-y-1 border-b border-terminal-border pb-3 text-[11px] text-terminal-text sm:grid-cols-4">
				<Meta label="role" value={project.role} />
				<Meta label="year" value={project.year} />
				<Meta label="plat" value={project.platform} />
				<Meta label="stat" value={project.status} />
			</div>

			{project.links?.length ? (
				<div className="mt-3 flex flex-wrap gap-2 text-[11px]">
					{project.links.map((link) => (
						<a
							key={link.href}
							href={link.href}
							target="_blank"
							rel="noreferrer"
							className="rounded-[2px] border border-terminal-border bg-terminal-panel px-2.5 py-1 text-terminal-blue transition-colors hover:border-terminal-blue/70 hover:text-terminal-text-bright focus-visible:outline-2 focus-visible:outline-terminal-blue"
						>
							{link.label} /open
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
					className="my-1 font-serif text-sm leading-relaxed text-terminal-text-soft"
				>
					<b className="text-terminal-purple">{decision.title}.</b>{' '}
					{decision.detail}
				</p>
			))}

			{project.coverImage ? (
				<figure className="mt-3 overflow-hidden rounded-[2px] border border-terminal-border bg-terminal-bg">
					<img
						src={project.coverImage}
						alt={
							project.coverAlt ??
							`${project.id} project screenshot`
						}
						loading="lazy"
						className="block max-h-[340px] w-full object-contain"
					/>
					<figcaption className="border-t border-terminal-border px-3 py-1.5 text-[11px] text-terminal-muted">
						img · {project.id} cover
					</figcaption>
				</figure>
			) : (
				<div className="terminal-case-placeholder mt-3 flex h-[110px] items-center justify-center border border-dashed border-terminal-border text-[11px] text-terminal-muted">
					img · {project.id} hero
				</div>
			)}
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
