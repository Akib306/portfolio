import { describe, expect, it } from 'vitest'

import { renderAsciiPortrait } from './asciiPortrait'

describe('ASCII portrait projection', () => {
	it('preserves the cutout silhouette with empty space around the subject', () => {
		const rows = renderAsciiPortrait().split('\n')
		expect(rows).toHaveLength(54)
		expect(rows.every((row) => row.length === 88)).toBe(true)
		expect(rows[0].trim()).toBe('')
		expect(rows[12].slice(0, 20).trim()).toBe('')
		expect(rows[12].slice(-20).trim()).toBe('')
		expect(rows.slice(8, 45).some((row) => row.trim().length > 20)).toBe(
			true,
		)
	})

	it('projects distinct left and right views while keeping the subject visible', () => {
		const front = renderAsciiPortrait()
		const left = renderAsciiPortrait(-0.72, 0.03)
		const right = renderAsciiPortrait(0.72, -0.03)
		expect(left).not.toBe(front)
		expect(right).not.toBe(front)
		expect(left).not.toBe(right)
		for (const frame of [left, right]) {
			expect(frame.split('\n')).toHaveLength(54)
			expect(frame.replace(/\s/g, '').length).toBeGreaterThan(600)
			expect(frame).not.toMatch(/NaN|undefined/)
		}
	})
})
