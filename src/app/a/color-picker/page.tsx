'use client'

import { hsvaToHex } from '@uiw/color-convert'
import Chrome from '@uiw/react-color-chrome'
import { useState } from 'react'

export default function ColorPickerPage() {
	const [hsva, setHsva] = useState({ h: 0, s: 0, v: 100, a: 1 })
	const hex = hsvaToHex(hsva)

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
