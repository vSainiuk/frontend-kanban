import { useCallback, useEffect, useRef, useState } from 'react'

const hoverScrollZone = 200

export function useHorizontalScroll() {
	const containerRef = useRef<HTMLDivElement>(null)
	const [isHoveringScrollbar, setIsHoveringScrollbar] = useState(true)

	const handleWheel = (event: WheelEvent) => {
		if (!isHoveringScrollbar && containerRef.current) {
			event.preventDefault()
			containerRef.current.scrollLeft += event.deltaY
		}
	}

	useEffect(() => {
		const container = containerRef.current
		if (container) {
			container.addEventListener('wheel', handleWheel, { passive: false })
		}

		return () => {
			if (container) {
				container.removeEventListener('wheel', handleWheel)
			}
		}
	}, [isHoveringScrollbar])

	const handleMouseMove = useCallback((event: React.MouseEvent) => {
		if (containerRef.current) {
			const { offsetWidth, scrollWidth, offsetLeft } = containerRef.current
			const isNearScrollbar =
				event.clientX > offsetLeft + offsetWidth - hoverScrollZone
			setIsHoveringScrollbar(isNearScrollbar) ///TODO: How to optimize this?
		}
	}, [])

	return {
		containerRef,
		isHoveringScrollbar,
		handleMouseMove,
		setIsHoveringScrollbar,
	}
}
