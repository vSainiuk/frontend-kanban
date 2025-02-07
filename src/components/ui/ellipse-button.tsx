import { motion } from 'framer-motion'
import { MousePointerClick } from 'lucide-react'
import { useState } from 'react'

interface EllipseButtonProps {
	onClick: () => void
	children?: React.ReactNode
}

export default function EllipseButton({
	onClick,
	children,
}: EllipseButtonProps) {
	const [isHovered, setIsHovered] = useState(false)
	return (
		<div className='relative w-fit ml-auto'>
			<motion.div
				className='absolute right-0 top-0 bottom-0 bg-card text-white cursor-pointer flex items-center justify-center'
				initial={{ width: '30px' }}
				animate={{ width: isHovered ? '80px' : '30px' }}
				transition={{ duration: 0.15, ease: 'easeOut' }}
				onClick={onClick}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={{
					borderTopLeftRadius: '100% 50%',
					borderBottomLeftRadius: '100% 50%',
				}}
			>
				<span className='text-2xl'>
					{isHovered ? <MousePointerClick className='w-8 h-8' /> : '+'}
				</span>
			</motion.div>

			{children}
		</div>
	)
}
