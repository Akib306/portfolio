import { createFileRoute } from '@tanstack/react-router'

import { TerminalPortfolio } from '#/TerminalPortfolio'
import { portfolio } from '#/data/portfolio'
import { pageDescription, pageTitle, siteUrl, structuredData } from '#/data/seo'

export const Route = createFileRoute('/')({
	head: () => ({
		meta: [
			{ title: pageTitle },
			{ name: 'description', content: pageDescription },
			{ name: 'author', content: portfolio.name },
			{ property: 'og:type', content: 'profile' },
			{ property: 'og:site_name', content: portfolio.name },
			{ property: 'og:title', content: pageTitle },
			{ property: 'og:description', content: pageDescription },
			{ property: 'og:url', content: siteUrl },
			{ property: 'og:locale', content: 'en_CA' },
			{ property: 'og:image', content: `${siteUrl}social-card.png` },
			{ property: 'og:image:width', content: '1200' },
			{ property: 'og:image:height', content: '630' },
			{
				property: 'og:image:alt',
				content: `${portfolio.name} — ${portfolio.role}`,
			},
			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'twitter:title', content: pageTitle },
			{ name: 'twitter:description', content: pageDescription },
			{ name: 'twitter:image', content: `${siteUrl}social-card.png` },
			{
				name: 'twitter:image:alt',
				content: `${portfolio.name} — ${portfolio.role}`,
			},
		],
		links: [{ rel: 'canonical', href: siteUrl }],
		scripts: [
			{
				type: 'application/ld+json',
				children: JSON.stringify(structuredData).replace(
					/</g,
					'\\u003c',
				),
			},
		],
	}),
	component: Home,
})

function Home() {
	return <TerminalPortfolio />
}
