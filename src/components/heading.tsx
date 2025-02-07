import { cn } from '@/lib/utils'

export default function Heading({
	children,
	classNames,
}: {
	children: React.ReactNode
	classNames?: string
}) {
	return (
		<h2 className={cn(`text-5xl text-left w-full font-cursive`, classNames)}>
			{children}
		</h2>
	)
}
