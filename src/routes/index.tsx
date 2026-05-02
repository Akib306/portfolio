import { createFileRoute } from '@tanstack/react-router'

import { TerminalPortfolio } from '#/TerminalPortfolio'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
	return <TerminalPortfolio />
}
