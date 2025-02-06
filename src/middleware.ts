import { NextRequest, NextResponse } from 'next/server'
import { DASHBOARD_PAGES } from './config/pages-url.config'
import { EnumTokens } from './services/auth-token.service'

export async function middleware(request: NextRequest, response: NextResponse) {
	const { url, cookies } = request
	
	const accessToken = cookies.get(EnumTokens.ACCESS_TOKEN)?.value

	const isAuthPage = url.includes('/auth')

	if (accessToken && isAuthPage) {
		/// If the user is logged in and tries to access the auth page, redirect to the home page
		return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, url))
	}

	if (isAuthPage) {
		/// If the user is not logged in and tries to access the auth page, allow access
		return NextResponse.next()
	}

	// if (!accessToken) {
	// 	/// If the user is not logged in and tries to access a page other than the auth page, redirect to the auth page
	// 	return NextResponse.redirect(new URL('/auth', request.url))
	// }

	return NextResponse.next()
}

export const config = {
	matcher: ['/a/:path*', '/auth/:path'],
}
