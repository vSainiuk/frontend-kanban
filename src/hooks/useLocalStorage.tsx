'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

export function useLocalStorage<T>(
	key: string,
	initialValue?: T
): [T, Dispatch<SetStateAction<T>>, boolean] {
	const [isLoading, setIsLoading] = useState(true)
	const valueFromLocalStorage = JSON.parse(localStorage.getItem(key) || 'null') 

	const isMounted = useRef(false)
	const [value, setValue] = useState<T>(
		initialValue ? initialValue : valueFromLocalStorage
	)

	useEffect(() => {
		try {
			const item = localStorage.getItem(key)
			if (item) {
				setValue(JSON.parse(item))
			}
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}

		return () => {
			isMounted.current = false
		}
	}, [key])

	useEffect(() => {
		if (isMounted.current) {
			window.localStorage.setItem(key, JSON.stringify(value))
		} else {
			isMounted.current = true
		}
	}, [key, value])

	return [value, setValue, isLoading]
}
