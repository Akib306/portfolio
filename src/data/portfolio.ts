import type { Portfolio } from '#/types'

// Sources and wording decisions are recorded in PORTFOLIO_AUDIT.md.
export const portfolio = {
	name: 'Motasin Akib',
	handle: 'motasin@portfolio',
	domain: 'motasin.dev',
	role: 'Software Developer',
	blurb: 'I am a 3rd year Computer Science student at the University of Saskatchewan. I am interested in full-stack applications, distributed systems, and AI interfaces. My current work includes a co-op with SSC CanAI and computer vision and robotics development at USask.',
	location: 'Saskatoon, Saskatchewan, Canada',
	socials: [
		{ label: 'GitHub', href: 'https://github.com/Akib306' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/akiba8728a/' },
	],
	experience: [
		{
			id: 'CANAI_SSC.coop',
			size: '12mo',
			date: '2026',
			desc: 'Software development co-op with SSC CanAI',
			role: 'Software Engineer co-op',
			organization: 'Government of Canada · SSC CanAI',
			status: 'CURRENT',
			period: 'Sep 2026–present · 12-month co-op',
			summary:
				'Software engineering co-op with SSC CanAI in the Government of Canada, based in Saskatoon.',
			highlights: [],
			links: [
				{
					label: 'LinkedIn profile',
					href: 'https://www.linkedin.com/in/akiba8728a/',
				},
			],
		},
		{
			id: 'USASK.robotics',
			size: '—',
			date: '2026',
			desc: 'Computer vision and robotics development at USask',
			role: 'Computer Vision & Robotics Developer',
			organization: 'University of Saskatchewan',
			status: 'CURRENT',
			period: '2026 · current role',
			summary:
				'Developing computer-vision, geospatial, and autonomous-flight systems for precision-agriculture research at the University of Saskatchewan.',
			highlights: [
				{
					title: 'Computer vision',
					detail: 'Work spans NDVI segmentation and multispectral crop systems.',
				},
				{
					title: 'Research systems',
					detail: 'Combines geospatial and autonomous-flight development for precision agriculture.',
				},
			],
			links: [
				{
					label: 'LinkedIn profile',
					href: 'https://www.linkedin.com/in/akiba8728a/',
				},
			],
		},
	],
	projects: [
		{
			id: 'campus-find.app',
			size: '—',
			date: '2025',
			desc: 'A campus lost-and-found platform with searchable listings and student messaging',
			role: 'Team project · full-stack development',
			status: 'WEB APP',
			tagline: 'Helping students find and return lost items',
			year: '2025',
			platform: 'TypeScript · Next.js · Supabase · PostgreSQL',
			problem:
				'Students need a central place to report missing items, browse found items, and arrange returns without sharing personal contact details.',
			insight:
				'Searchable listings and campus sign-in give students a practical route from reporting an item to coordinating its return.',
			decisions: [
				{
					title: 'Campus accounts',
					detail: 'USask email sign-in connects the lost-and-found workflow to the campus community.',
				},
				{
					title: 'Item discovery',
					detail: 'Keyword, category, and location filters help students find relevant reports.',
				},
				{
					title: 'Private coordination',
					detail: 'Built-in messaging lets students discuss a claim or return without publishing their contact information.',
				},
			],
			links: [
				{
					label: 'Source on GitHub',
					href: 'https://github.com/Akib306/Campus-Find',
				},
			],
		},
		{
			id: 'seamlessAI.app',
			size: '—',
			date: '2025',
			desc: 'Multi-model AI chat with streaming responses, saved conversations, and full-text search',
			role: 'Full-stack development',
			status: 'WEB APP',
			tagline: 'One workspace for conversations across AI models',
			year: '2025–2026',
			platform: 'TypeScript · Next.js · Supabase · Vercel AI SDK',
			problem:
				'Switching between AI providers can fragment conversations and make useful answers difficult to find again.',
			insight:
				'A shared chat interface, persistent history, and search keep conversations accessible across model choices.',
			decisions: [
				{
					title: 'Provider integration',
					detail: 'Google and OpenAI models share a streaming conversation interface through the Vercel AI SDK.',
				},
				{
					title: 'Persistent history',
					detail: 'Supabase stores profiles, chats, and messages with row-level security and authenticated access.',
				},
				{
					title: 'Search and readable answers',
					detail: 'Full-text search with highlighting, Markdown, code blocks, and math rendering help users revisit and understand responses.',
				},
			],
			links: [
				{
					label: 'Source on GitHub',
					href: 'https://github.com/Akib306/seemless.chat',
				},
			],
		},
		{
			id: '8ball+.game',
			size: '—',
			date: '2025',
			desc: 'An arcade pool game with turn-based scoring and power-ups',
			role: 'Team project · ball physics, scoring, scene management',
			status: 'GAME',
			tagline: 'Arcade pool with a focus on physics and game flow',
			year: '2024–2025',
			platform: 'Godot · GDScript',
			problem:
				'A pool game needs reliable ball motion, clear scoring rules, and predictable transitions between the menu, match, and result screen.',
			insight:
				'Keeping physics, scoring, and scene transitions consistent makes each match easier to follow and debug.',
			decisions: [
				{
					title: 'Ball simulation',
					detail: 'Implemented ball generation and triangle spawning, and refined rotation, momentum, and angular motion.',
				},
				{
					title: 'Scoring and rules',
					detail: 'Built scoring logic, the score rack UI, win conditions, and black-ball handling.',
				},
				{
					title: 'Scene transitions',
					detail: 'Implemented a singleton SceneManager for menu, game, and game-over transitions, including the winner display and confetti.',
				},
			],
			links: [
				{
					label: 'Play 8Ball+',
					href: 'https://akib306.itch.io/8ball-plus',
				},
				{
					label: 'Source on GitHub',
					href: 'https://github.com/Akib306/8Ball',
				},
			],
		},
	],
} satisfies Portfolio

export default portfolio
