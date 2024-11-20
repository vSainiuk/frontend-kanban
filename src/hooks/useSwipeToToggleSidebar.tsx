import { useEffect, useRef } from 'react'

export function useSwipeToToggleSidebar(
	isCollapsed: boolean,
	setIsCollapsed: (value: boolean) => void
) {
	const sidebarRef = useRef<HTMLElement | null>(null)
	const startXRef = useRef(0)
	const isMouseDown = useRef(false)
	const rangeSwipe = 35

	// Перевірка, чи є пристрій планшетом або ПК
	const isTabletOrDesktop = () => {
		return window.innerWidth >= 640
	}

	// Обробник початку свайпа або кліку
	const handleStart = (e: MouseEvent | TouchEvent) => {
		startXRef.current = 'touches' in e ? e.touches[0].clientX : e.clientX
		isMouseDown.current = true
	}

	// Обробник для руху
	const handleMove = (e: MouseEvent | TouchEvent) => {
		if (!isMouseDown.current) return

		const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX
		if (startXRef.current - currentX > rangeSwipe) {
			setIsCollapsed(true)
			isMouseDown.current = false
		} else if (startXRef.current - currentX < -rangeSwipe) {
			setIsCollapsed(false)
			isMouseDown.current = false
		}
	}

	// Обробник завершення свайпа
	const handleEnd = () => {
		isMouseDown.current = false
	}

	useEffect(() => {
		const sidebar = sidebarRef.current

		if (!sidebar) return

		// Оновлюємо слухачі подій на основі типу пристрою
		const updateListeners = () => {
			if (isTabletOrDesktop()) {
				sidebar.addEventListener('mousedown', handleStart)
				document.addEventListener('mousemove', handleMove)
				document.addEventListener('mouseup', handleEnd)
				sidebar.addEventListener('touchstart', handleStart)
				document.addEventListener('touchmove', handleMove)
				document.addEventListener('touchend', handleEnd)
			} else {
				sidebar.removeEventListener('mousedown', handleStart)
				document.removeEventListener('mousemove', handleMove)
				document.removeEventListener('mouseup', handleEnd)
				sidebar.removeEventListener('touchstart', handleStart)
				document.removeEventListener('touchmove', handleMove)
				document.removeEventListener('touchend', handleEnd)
			}
		}

		// Ініціалізуємо слухачі подій
		updateListeners()

		// Оновлюємо слухачі подій при зміні розміру вікна
		window.addEventListener('resize', updateListeners)

		return () => {
			window.removeEventListener('resize', updateListeners)
			sidebar.removeEventListener('mousedown', handleStart)
			document.removeEventListener('mousemove', handleMove)
			document.removeEventListener('mouseup', handleEnd)
			sidebar.removeEventListener('touchstart', handleStart)
			document.removeEventListener('touchmove', handleMove)
			document.removeEventListener('touchend', handleEnd)
		}
	}, [isCollapsed])

	return { sidebarRef }
}
