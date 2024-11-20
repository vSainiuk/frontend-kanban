interface BadgeProps {
	children: React.ReactNode
}

export default function Badge({ children }: BadgeProps) {
	return (
		<div>
			<span className='w-fit h-5 rounded-3xl bg-red-500 text-white text-sm leading-[14px] p-1'>
				{children}
			</span>
		</div>
	)
}
