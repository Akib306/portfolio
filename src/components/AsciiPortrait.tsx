import { useEffect, useRef, useState } from 'react'

import { initialPortrait, renderAsciiPortrait } from '#/asciiPortrait'

type AsciiPortraitProps = { name: string }

export function AsciiPortrait({ name }: AsciiPortraitProps) {
	const [paused, setPaused] = useState(false)
	const [visible, setVisible] = useState(false)
	const [pageVisible, setPageVisible] = useState(true)
	const [reducedMotion, setReducedMotion] = useState(false)
	const portraitRef = useRef<HTMLElement>(null)
	const textRef = useRef<HTMLPreElement>(null)
	const elapsedRef = useRef(0)
	const rotating = !paused && visible && pageVisible && !reducedMotion

	useEffect(() => {
		const media = window.matchMedia('(prefers-reduced-motion: reduce)')
		const updateMotion = () => {
			setReducedMotion(media.matches)
			if (media.matches && textRef.current)
				textRef.current.textContent = initialPortrait
		}
		updateMotion()
		media.addEventListener('change', updateMotion)
		const updateVisibility = () => setPageVisible(!document.hidden)
		updateVisibility()
		document.addEventListener('visibilitychange', updateVisibility)
		// Older browsers without an observer retain the static, immediate portrait.
		const observer =
			typeof IntersectionObserver === 'undefined'
				? undefined
				: new IntersectionObserver(([entry]) =>
						setVisible(entry.isIntersecting),
					)
		if (portraitRef.current) observer?.observe(portraitRef.current)
		return () => {
			observer?.disconnect()
			media.removeEventListener('change', updateMotion)
			document.removeEventListener('visibilitychange', updateVisibility)
		}
	}, [])

	useEffect(() => {
		if (!rotating) return
		let frame = 0
		let previous = 0
		const draw = (time: number) => {
			if (!previous) previous = time
			if (time - previous >= 1000 / 12) {
				elapsedRef.current += Math.min(time - previous, 150)
				previous = time
				const phase = elapsedRef.current / 2200
				if (textRef.current) {
					textRef.current.textContent = renderAsciiPortrait(
						Math.sin(phase) * 0.72,
						Math.sin(phase * 0.5) * 0.06,
					)
				}
			}
			frame = requestAnimationFrame(draw)
		}
		frame = requestAnimationFrame(draw)
		return () => cancelAnimationFrame(frame)
	}, [rotating])

	return (
		<figure ref={portraitRef} className="terminal-portrait">
			<button
				type="button"
				className="terminal-portrait-toggle"
				disabled={reducedMotion}
				onClick={() => setPaused((current) => !current)}
				aria-label={
					paused
						? 'Resume portrait rotation'
						: 'Pause portrait rotation'
				}
			>
				<div
					className="terminal-portrait-scene"
					role="img"
					aria-label={`ASCII portrait of ${name}`}
					data-animation-state={rotating ? 'running' : 'paused'}
					data-page-visible={pageVisible}
				>
					<pre
						ref={textRef}
						className="terminal-portrait-points"
						aria-hidden="true"
					>
						{initialPortrait}
					</pre>
				</div>
			</button>
		</figure>
	)
}
