import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.scss'
import './custom-styles/scrollbar-styles.scss'
import './custom-styles/loader-circle.scss'

import { Providers } from './providers'

const fontFamily = Noto_Sans({
	subsets: ['cyrillic', 'latin'],
	display: 'swap',
	weight: ['300', '400', '500', '600', '700'],
	variable: '--noto-sans',
	style: 'normal',
})

export const metadata: Metadata = {
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`,
	},
	description: 'Description', /// TODO: Change this
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${fontFamily.className} antialiased`}>
				<Providers>
					{children}
					<Toaster theme='dark' expand position='bottom-right' closeButton={true} duration={1500} />
				</Providers>
			</body>
		</html>
	)
}
