import { portfolio } from './portfolio'

export const siteUrl = `https://${portfolio.domain}/`
export const pageTitle = `${portfolio.name} | ${portfolio.role} in Saskatoon`
export const pageDescription =
	'Motasin Akib is a software developer in Saskatoon and a USask Computer Science student. Explore full-stack, AI, robotics, and game development projects.'

export const structuredData = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'WebSite',
			'@id': `${siteUrl}#website`,
			url: siteUrl,
			name: portfolio.name,
			alternateName: portfolio.domain,
		},
		{
			'@type': 'ProfilePage',
			'@id': `${siteUrl}#profile`,
			url: siteUrl,
			name: pageTitle,
			description: pageDescription,
			isPartOf: { '@id': `${siteUrl}#website` },
			mainEntity: { '@id': `${siteUrl}#person` },
			hasPart: portfolio.projects.map((project) => ({
				'@type': 'CreativeWork',
				name: project.tagline,
				description: project.desc,
				url: project.links[0].href,
			})),
		},
		{
			'@type': 'Person',
			'@id': `${siteUrl}#person`,
			name: portfolio.name,
			url: siteUrl,
			jobTitle: portfolio.role,
			description: portfolio.blurb,
			image: `${siteUrl}images/portrait-cutout.png`,
			homeLocation: { '@type': 'Place', name: portfolio.location },
			sameAs: portfolio.socials.map((social) => social.href),
		},
	],
}
