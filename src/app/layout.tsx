import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { Allura, Noto_Sans, Barlow as labelFont } from 'next/font/google'
import { Toaster } from 'sonner'
import './custom-styles/loader-circle.scss'
import './custom-styles/scrollbar-styles.scss'
import './globals.scss'

import { Providers } from './providers'
import { CURRENT_POSITION_TOASTER, DEFAULT_DURATION_TOASTER } from '@/constants/toaster'

const fontFamily = Noto_Sans({
	subsets: ['cyrillic', 'latin'],
	display: 'swap',
	weight: ['300', '400', '500', '600', '700'],
	variable: '--noto-sans',
	style: 'normal',
})

const allura = Allura({
	subsets: ['latin'],
	display: 'swap',
	weight: '400',
	variable: '--allura-font',
})

const label = labelFont({
	subsets: ['latin'],
	display: 'swap',
	weight: '400', 
	variable: '--label-font',
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
		<html lang='en' className={`${allura.variable} ${label.variable}`}>
			<body className={`${fontFamily.className} antialiased`}>
				<Providers>
					{children}
					<Toaster
						theme='dark'
						expand
						position={CURRENT_POSITION_TOASTER}
						closeButton={true}
						duration={DEFAULT_DURATION_TOASTER}
					/>
				</Providers>
			</body>
		</html>
	)
}
