import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'Motasin Akib | Software Developer',
			},
			{
				name: 'description',
				content:
					'Motasin Akib — Computer Science at the University of Saskatchewan. Explore full-stack applications, AI interfaces, games, and current experience.',
			},
			{
				name: 'theme-color',
				content: '#1a1d23',
			},
		],
		links: [
			{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
			{ rel: 'manifest', href: '/manifest.json' },
			{
				rel: 'preconnect',
				href: 'https://fonts.googleapis.com',
			},
			{
				rel: 'preconnect',
				href: 'https://fonts.gstatic.com',
				crossOrigin: 'anonymous',
			},
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap',
			},
			{
				rel: 'stylesheet',
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	)
}
