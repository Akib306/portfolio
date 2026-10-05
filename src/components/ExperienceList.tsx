import type { Experience, Portfolio } from '#/types'

type ExperienceListProps = {
	portfolio: Portfolio
	experienceIds: ReadonlyArray<Experience['id']>
	blockId: string
	isExperienceOpen: (blockId: string, experienceId: string) => boolean
	onToggleExperience: (blockId: string, experienceId: string) => void
}

export function ExperienceList({
	portfolio,
	experienceIds,
	blockId,
	isExperienceOpen,
	onToggleExperience,
}: ExperienceListProps) {
	const experiences = experienceIds
		.map((id) =>
			portfolio.experience.find((experience) => experience.id === id),
		)
		.filter((experience): experience is Experience => Boolean(experience))
	return (
		<div
			className="mt-1 flex flex-col gap-px"
			role="list"
			aria-label="Experience files"
		>
			{experiences.map((experience) => {
				const open = isExperienceOpen(blockId, experience.id)
				const detailsId = `${blockId}-${experience.id}-details`
				return (
					<div key={experience.id} role="listitem">
						<button
							type="button"
							aria-expanded={open}
							aria-controls={detailsId}
							aria-label={`${open ? 'Collapse' : 'Expand'} ${experience.id}: ${experience.desc}`}
							onClick={() =>
								onToggleExperience(blockId, experience.id)
							}
							className={`terminal-project-row grid w-full grid-cols-[18px_minmax(0,1fr)_auto] gap-x-3 gap-y-1 border-0 border-l-2 px-2 py-2 text-left font-[inherit] text-[inherit] text-terminal-text ${open ? 'border-l-terminal-blue bg-terminal-blue/10' : 'border-l-transparent'}`}
						>
							<span
								aria-hidden="true"
								className={`text-center font-bold text-terminal-blue transition-transform ${open ? 'rotate-90' : ''}`}
							>
								›
							</span>
							<span className="terminal-file-name text-terminal-yellow">
								{experience.id}
							</span>
							<span className="terminal-meta text-terminal-muted">
								{open ? '[ close ]' : '[ open ]'}
							</span>
							<span className="terminal-prose col-span-2 col-start-2 text-terminal-text-bright">
								{experience.role} · {experience.organization}
							</span>
							<span className="terminal-meta col-span-2 col-start-2 text-terminal-muted">
								{experience.period} · {experience.status}
							</span>
						</button>
						<section
							id={detailsId}
							hidden={!open}
							aria-label={`Experience details for ${experience.id}`}
						>
							{open ? (
								<div className="terminal-case mb-2 ml-0 mt-1 border border-terminal-border px-4 py-3 sm:ml-7">
									<h2 className="terminal-title text-terminal-text-bright">
										{experience.role}
									</h2>
									<p className="terminal-meta mt-1 text-terminal-muted">
										{experience.organization} ·{' '}
										{experience.period}
									</p>
									<p className="terminal-prose mt-4 text-terminal-text-soft">
										{experience.summary}
									</p>
									{experience.highlights.length ? (
										<ul className="terminal-prose mt-4 space-y-3">
											{experience.highlights.map(
												(highlight) => (
													<li
														key={highlight.title}
														className="text-terminal-text-soft"
													>
														<strong className="font-semibold text-terminal-purple">
															{highlight.title}.
														</strong>{' '}
														{highlight.detail}
													</li>
												),
											)}
										</ul>
									) : null}
									{experience.links?.length ? (
										<div className="mt-4 flex flex-wrap gap-4">
											{experience.links.map((link) => (
												<a
													key={link.href}
													href={link.href}
													target="_blank"
													rel="noreferrer"
													className="terminal-link terminal-meta"
												>
													{link.label}
													<span className="sr-only">
														{' '}
														(opens in a new tab)
													</span>
												</a>
											))}
										</div>
									) : null}
								</div>
							) : null}
						</section>
					</div>
				)
			})}
		</div>
	)
}
