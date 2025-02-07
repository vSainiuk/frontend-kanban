import { cn } from '@/lib/utils'

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
	position?: 'center'
}

export default function Loader({ position, className, ...props }: LoaderProps) {
	return (
		<div
			{...props}
			className={cn(
				'loader-circle',
				position === 'center' &&
					'absolute top-2/4 right-2/4 translate-x-1/2 -translate-y-1/2',
				className
			)}
		></div>
	)
}
