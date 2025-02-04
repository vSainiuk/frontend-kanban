'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Chrome = dynamic(() => import('@uiw/react-color-chrome'), { ssr: false })

export default function ColorPickerPage() {
	const [hsva, setHsva] = useState({ h: 0, s: 0, v: 100, a: 1 })
	const [hex, setHex] = useState('#ffffff')

	useEffect(() => {
		import('@uiw/color-convert').then(({ hsvaToHex }) => {
			setHex(hsvaToHex(hsva))
		})
	}, [hsva])

	return (
		<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
			<Chrome
				color={hsva}
				onChange={color => setHsva(color.hsva)}
				style={{
					marginBottom: '20px',
					backgroundColor: '#201926',
					padding: '10px',
					borderRadius: '8px',
				}}
			/>

			<div
				style={{
					background: hex,
					height: '100px',
					width: '100px',
					borderRadius: '8px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: '#d63b3b',
					fontWeight: 'bold',
					boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
				}}
			></div>
		</div>
	)
}
