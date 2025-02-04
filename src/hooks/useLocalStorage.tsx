'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

export function useLocalStorage<T>(
	key: string,
	initialValue?: T
): [T, Dispatch<SetStateAction<T>>, boolean] {
	const [isLoading, setIsLoading] = useState(true)
	const isMounted = useRef(false)
	const [value, setValue] = useState<T>(() => {
		if (typeof window === 'undefined') return initialValue as T
		try {
			const storedValue = window.localStorage.getItem(key)
			return storedValue ? JSON.parse(storedValue) : initialValue
		} catch (error) {
			console.error('Error reading localStorage:', error)
			return initialValue as T
		}
	})

	useEffect(() => {
		if (typeof window === 'undefined') return
		try {
			const storedValue = localStorage.getItem(key)
			if (storedValue) setValue(JSON.parse(storedValue))
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}, [key])

	useEffect(() => {
		if (typeof window === 'undefined') return
		if (isMounted.current) {
			window.localStorage.setItem(key, JSON.stringify(value))
		} else {
			isMounted.current = true
		}
	}, [key, value])

	return [value, setValue, isLoading]
}
