import type { Portfolio } from '#/types'

// Shared portfolio data — placeholder content; will be replaced later.
export const portfolio = {
	name: 'Motasin Akib',
	handle: 'motasin@portfolio',
	domain: 'motasin.dev',
	role: 'Software Engineer',
	blurb: 'I am a 3rd year Computer Science student at the University of Saskatchewan. I am currently working a 12-month co-op with CanAi SSC as a Software Engineer.',
	location: 'Saskatoon, Saskatchewan, Canada',
	focus: 'Full-stack Web Development · AI Interfaces · Game Development',
	contact: '306akib@gmail.com',
	projects: [
		{
			id: 'campus-find.app',
			size: '949kb',
			date: '2025-11',
			desc: 'USask lost-and-found platform with verified posts, search, alerts, and messaging',
			role: 'Team project — full-stack development',
			status: 'LIVE',
			tagline: 'A verified lost-and-found workflow for USask students',
			year: '2025',
			platform: 'TypeScript · Next.js · PostgreSQL · Docker',
			problem:
				'USask students need a trusted place to report missing items, search recent found posts, and coordinate returns without exposing personal contact details.',
			insight:
				'CampusFind turns the lost-and-found process into a structured workflow with searchable listings, standardized deployment paths, and team-owned delivery practices.',
			decisions: [
				{
					title: 'Team delivery',
					detail: 'Led a five-person team using Scrum meetings, code reviews, and issue tracking to keep development moving predictably.',
				},
				{
					title: 'Database discipline',
					detail: 'Introduced database migrations and standardized local, staging, and production workflows to prevent schema drift.',
				},
				{
					title: 'Fast item search',
					detail: 'Engineered PostgreSQL full-text search for lost-item discovery with roughly 100 ms search latency.',
				},
				{
					title: 'Deployment automation',
					detail: 'Automated environment verification and deployments with GitLab CI to reduce manual release effort and deployment risk.',
				},
			],
			coverImage: '/campus-find.png',
			coverAlt:
				'CampusFind landing page screenshot showing USask verified search, alerts, reporting, messaging, and community features.',
			links: [
				{
					label: 'GitHub',
					href: 'https://github.com/Akib306/Campus-Find',
				},
				{
					label: 'Live',
					href: 'https://campus-find-three.vercel.app/',
				},
			],
		},
		{
			id: '8ball+.game',
			size: '449kb',
			date: '2025-01',
			desc: '2D 8-ball pool game with player HUD, scoring, cue aiming, and power-up slots',
			role: 'Team game project — gameplay and UI',
			status: 'PLAYABLE',
			tagline: 'An arcade-style 8-ball match with dynamic power-ups',
			year: '2025',
			platform: 'Godot · GDScript',
			problem:
				'The game needed readable pool mechanics, dynamic power-ups, scoring logic, and stable UI/game-state transitions inside a fast team build.',
			insight:
				'The strongest improvements came from tightening core gameplay physics and reducing duplicated state paths across transitions.',
			decisions: [
				{
					title: 'Team collaboration',
					detail: 'Built the game in a four-person team using modern Agile practices to coordinate gameplay, UI, and iteration.',
				},
				{
					title: 'Physics and mechanics',
					detail: 'Engineered realistic ball physics and core gameplay mechanics, reducing the time to debug scoring issues by roughly 50%.',
				},
				{
					title: 'State management',
					detail: 'Used the singleton design pattern for smoother UI transitions and game-state management while reducing duplicated state logic by roughly 40%.',
				},
			],
			coverImage: '/8ball+.png',
			coverAlt:
				'8Ball+ gameplay screenshot showing a pool table, cue aim line, player HUD, score, and power-up slots.',
			links: [
				{
					label: 'GitHub',
					href: 'https://github.com/Akib306/8Ball',
				},
				{
					label: 'Live',
					href: 'https://akib306.itch.io/8ball-plus',
				},
			],
		},
		{
			id: 'seamlessAI.app',
			size: '369kb',
			date: '2026-06',
			desc: 'AI chat workspace with persistent conversations, search, and model-aware prompt controls',
			role: 'Prototype — chat UX and AI integration',
			status: 'LIVE',
			tagline: 'A multi-model conversational AI app built for speed',
			year: '2026',
			platform: 'TypeScript · Next.js · PostgreSQL · Redis',
			problem:
				'Multi-model AI chat gets slow and difficult to navigate when provider routing, long conversation history, search, and real-time messaging are not optimized together.',
			insight:
				'SeamlessAI focuses on performance across the full chat loop: API response caching, render caching, searchable history, and low-latency messaging.',
			decisions: [
				{
					title: 'API latency',
					detail: 'Reduced API response latency by 66%, from roughly 300 ms to 100 ms, with Redis read-through and write-through caching.',
				},
				{
					title: 'Render performance',
					detail: 'Reduced render time by 90%, from roughly 1000 ms to 100 ms, using a client-side in-memory LRU cache.',
				},
				{
					title: 'Multi-provider workflow',
					detail: 'Built REST APIs that support chat workflows across OpenAI, Google, and other model providers.',
				},
				{
					title: 'Conversation search',
					detail: 'Engineered PostgreSQL search for chat history so users can search millions of characters of conversation data efficiently.',
				},
				{
					title: 'Realtime messaging',
					detail: 'Developed a real-time messaging interface with roughly 50 ms latency using Supabase.',
				},
			],
			coverImage: '/seamless.png',
			coverAlt:
				'Seamless Chat screenshot showing an AI conversation workspace with chat history, search, a GPT 4.1 Nano selector, and message composer.',
			links: [
				{
					label: 'GitHub',
					href: 'https://github.com/Akib306/seemless.chat',
				},
				{
					label: 'Live',
					href: 'https://seamlessai.chat',
				},
			],
		},
	],
} satisfies Portfolio

export default portfolio
