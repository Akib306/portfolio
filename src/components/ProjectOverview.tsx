import type { Portfolio } from '#/types'

// Native disclosure keeps these summaries in the server-rendered HTML and
// readable without JavaScript while preserving the terminal's initial layout.
export function ProjectOverview({ portfolio }: { portfolio: Portfolio }) {
	return (
		<details className="terminal-prose mt-4">
			<summary className="cursor-pointer text-terminal-blue">
				Project overview
			</summary>
			<div className="mt-3 space-y-5">
				{portfolio.projects.map((project) => (
					<article key={project.id}>
						<h2 className="terminal-title text-terminal-text-bright">
							{project.tagline}
						</h2>
						<p className="mt-1">{project.desc}</p>
						<p className="terminal-meta mt-1 text-terminal-muted">
							{project.platform}
						</p>
						<div className="mt-1 flex flex-wrap gap-x-4">
							{project.links?.map((link) => (
								<a
									key={link.href}
									href={link.href}
									className="terminal-link terminal-meta"
								>
									{link.label}
								</a>
							))}
						</div>
					</article>
				))}
			</div>
		</details>
	)
}
