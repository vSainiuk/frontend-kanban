import { Home, Album, Timer, Settings, LogOut, Logs } from 'lucide-react'
import type { MenuItem } from './MenuItem'

export const menuData: MenuItem[] = [
	// {
	// 	title: 'Dashboard',
	// 	icon: Home,
	// 	link: '/a',
	// },
	{
		title: 'Tasks (Lite)',
		icon: Logs,
		link: '/a/tasks-lite',
	},
	// {
	// 	title: 'Color Picker',
	// 	icon: Logs,
	// 	link: '/a/color-picker',
	// },
	// {
	// 	title: 'Timer',
	// 	icon: Timer,
	// 	link: '/a/timer',
	// },
	// {
	// 	title: 'Settings',
	// 	icon: Settings,
	// 	link: '/a/settings',
	// },
	{
		title: 'Log Out',
		icon: LogOut,
		link: '-',
	}
]