import { cn } from '@/lib/utils'
import { forwardRef, InputHTMLAttributes } from 'react'
import { Input } from './input'

type TransparentField = InputHTMLAttributes<HTMLInputElement>

export const TransparentInput = forwardRef<HTMLInputElement, TransparentField>(
	({ className, ...rest }, ref) => {
		return (
			<Input
				className={cn(
					'bg-transparent focus:outline-0 focus:shadow-transparent w-full',
					className
				)}
				{...rest}
				ref={ref}
			/>
		)
	}
)

TransparentInput.displayName = 'TransparentInput'