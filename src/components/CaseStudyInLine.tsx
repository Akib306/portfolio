import type { Project } from '#/types'

type CaseStudyInLineProps = {
	project: Project
}

export function CaseStudyInLine({ project }: CaseStudyInLineProps) {
	return (
		<div className="terminal-case ml-0 mt-1 mb-2 border border-[#2a2f37] border-l-2 border-l-[#61afef] bg-white/[0.015] px-4 py-3 sm:ml-7 sm:px-[18px]">
			<div className="font-serif text-[22px] leading-tight font-medium tracking-[-0.2px] text-[#dcdfe4]">
				{project.tagline}
			</div>

			<div className="mt-3 grid gap-x-3 gap-y-1 border-b border-[#2a2f37] pb-3 text-[11px] text-[#abb2bf] sm:grid-cols-4">
				<Meta label="role" value={project.role} />
				<Meta label="year" value={project.year} />
				<Meta label="plat" value={project.platform} />
				<Meta label="stat" value={project.status} />
			</div>

			<CaseSection title="// the problem">{project.problem}</CaseSection>
			<CaseSection title="// the insight">{project.insight}</CaseSection>

			<div className="mt-4 mb-1 text-[11px] tracking-[0.04em] text-[#c678dd]">
				// design decisions
			</div>
			{project.decisions.map((decision) => (
				<p
					key={decision.title}
					className="my-1 font-serif text-sm leading-relaxed text-[#c5cad3]"
				>
					<b className="text-[#c678dd]">{decision.title}.</b>{' '}
					{decision.detail}
				</p>
			))}

			<div className="terminal-case-placeholder mt-3 flex h-[110px] items-center justify-center border border-dashed border-[#2a2f37] text-[11px] text-[#5c6370]">
				img · {project.id} hero
			</div>
		</div>
	)
}

function Meta({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<span className="mb-0.5 block tracking-[0.04em] text-[#5c6370]">
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
			<div className="mt-4 mb-1 text-[11px] tracking-[0.04em] text-[#c678dd]">
				{title}
			</div>
			<p className="my-1 font-serif text-sm leading-relaxed text-[#c5cad3]">
				{children}
			</p>
		</section>
	)
}
