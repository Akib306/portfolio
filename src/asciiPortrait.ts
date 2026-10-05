import { portraitPointData } from '#/data/profileAscii'

export const PORTRAIT_COLUMNS = 88
export const PORTRAIT_ROWS = 54
const GLYPHS = ' .:-=+*#%@'
// Each sample stores normalized x/y, inferred surface depth, and photo luminance.
const points = Uint8Array.from(atob(portraitPointData), (byte) =>
	byte.charCodeAt(0),
)

export function renderAsciiPortrait(yaw = 0, pitch = 0): string {
	const cells = Array<string>(PORTRAIT_COLUMNS * PORTRAIT_ROWS).fill(' ')
	const depthBuffer = new Float32Array(cells.length).fill(-Infinity)
	const cosYaw = Math.cos(yaw)
	const sinYaw = Math.sin(yaw)
	const cosPitch = Math.cos(pitch)
	const sinPitch = Math.sin(pitch)

	for (let i = 0; i < points.length; i += 4) {
		const x = (points[i] / 255 - 0.5) * 2.3
		const y = (points[i + 1] / 255 - 0.5) * 2.3
		const z = (points[i + 2] / 255) * 0.85 - 0.22
		const rotatedX = x * cosYaw + z * sinYaw
		const rotatedZ = z * cosYaw - x * sinYaw
		const rotatedY = y * cosPitch - rotatedZ * sinPitch
		const depth = rotatedZ * cosPitch + y * sinPitch
		const perspective = 4 / (4 - depth)
		const column = Math.round(
			PORTRAIT_COLUMNS / 2 + rotatedX * perspective * 32,
		)
		const row = Math.round(
			PORTRAIT_ROWS / 2 + rotatedY * perspective * 19.2,
		)
		if (
			column < 0 ||
			column >= PORTRAIT_COLUMNS ||
			row < 0 ||
			row >= PORTRAIT_ROWS
		)
			continue
		const index = row * PORTRAIT_COLUMNS + column
		if (depth <= depthBuffer[index]) continue
		depthBuffer[index] = depth
		// Keep dark hair legible; directional shading makes the curved surface turn.
		const light = 0.83 + 0.17 * Math.cos(yaw + x * 0.8)
		const intensity = (0.12 + (1 - points[i + 3] / 255) * 0.88) * light
		cells[index] =
			GLYPHS[
				Math.min(
					GLYPHS.length - 1,
					Math.round(intensity * (GLYPHS.length - 1)),
				)
			]
	}

	return Array.from({ length: PORTRAIT_ROWS }, (_, row) =>
		cells
			.slice(row * PORTRAIT_COLUMNS, (row + 1) * PORTRAIT_COLUMNS)
			.join(''),
	).join('\n')
}

export const initialPortrait = renderAsciiPortrait()
