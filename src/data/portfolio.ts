import type { Portfolio } from '#/types'

// Shared portfolio data — placeholder content; will be replaced later.
export const portfolio = {
	name: 'Motasin Akib',
	handle: 'motasin@portfolio',
	domain: 'motasin.dev',
	role: 'Software Engineer',
	blurb:
		'I am a 3rd year Computer Science student at the University of Saskatchewan. I am currently working a 12-month co-op with CanAi SSC as a Software Engineer',
	location: 'Saskatoon, Saskatchewan, Canada',
	focus: 'Web Development · AI · Machine Learning',
	contact: '306akib@gmail.com',
	projects: [
		{
			id: 'PROJECT_ALPHA.app',
			size: '12.4kb',
			date: '2025-03',
			desc: 'Short one-line description of project alpha',
			role: 'Solo — design, code',
			status: 'LIVE',
			tagline: 'Tagline that makes someone want to read more',
			year: '2025',
			platform: 'iOS + Web',
			problem:
				'What problem this solves, in plain language. Two sentences max here. Replace with your own copy.',
			insight:
				'The key insight that made this work. The thing nobody else noticed.',
			decisions: [
				{
					title: 'Decision one',
					detail: 'Why it mattered and what it looked like in the product.',
				},
				{
					title: 'Decision two',
					detail: 'Trade-offs you made and what you learned from them.',
				},
				{
					title: 'Decision three',
					detail: 'A constraint you embraced rather than fought.',
				},
			],
		},
		{
			id: 'PROJECT_BETA.case',
			size: '38.1kb',
			date: '2025-01',
			desc: 'Short one-line description of project beta',
			role: 'Product design lead',
			status: 'UNRELEASED',
			tagline: 'A second tagline',
			year: '2025',
			platform: 'iOS — Web',
			problem: 'Case study problem statement. Replace this.',
			insight: 'Insight goes here.',
			decisions: [
				{
					title: 'First',
					detail: 'Detail.',
				},
				{
					title: 'Second',
					detail: 'Detail.',
				},
			],
		},
		{
			id: 'PROJECT_GAMMA.log',
			size: '94.7kb',
			date: '2021-2023',
			desc: 'Three products — long-form description',
			role: 'founding designer & brand lead',
			status: 'ARCHIVED',
			tagline: 'Three products, eighteen months',
			year: '2021–2023',
			platform: 'Chrome — Web — Mobile',
			problem: 'What you were exploring across these products.',
			insight: 'What the pivot taught you.',
			decisions: [
				{
					title: 'Kill the form',
					detail: 'Keep the thesis.',
				},
				{
					title: 'Speed is a constraint',
					detail: 'Design for fast iteration.',
				},
			],
		},
		{
			id: 'PROJECT_DELTA.dir',
			size: '6.5kb',
			date: '2023-2024',
			desc: 'Brand & motion — events and identity',
			role: 'Creative director',
			status: 'DELIVERED',
			tagline: 'Identity, motion, three cities',
			year: '2023–2024',
			platform: 'Brand · Motion · Events',
			problem: 'Brand brief.',
			insight: 'Visual language insight.',
			decisions: [
				{
					title: 'Identity relaunch',
					detail: 'What changed and why.',
				},
				{
					title: 'Events',
					detail: 'Three cities, what they shared.',
				},
			],
		},
	],
} satisfies Portfolio

export default portfolio