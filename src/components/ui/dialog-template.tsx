import { Button } from './button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './dialog'
import { Input } from './input'

interface DialogTemplateProps {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	children: React.ReactNode
	title: string
	btnText: string
	onClick: () => void
	inputProps: {
		value: string
		onChange: any
	}
}

export default function DialogTemplate({
	open,
	setOpen,
	children,
	title,
	btnText,
	onClick,
	inputProps: { value, onChange },
}: DialogTemplateProps) {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			onClick()
		}
	}
	return (
		<Dialog open={open} onOpenChange={() => setOpen(prev => !prev)}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent aria-describedby='modal-content' className='sm:max-w-md'>
				<DialogHeader className='flex gap-2'>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						<Input
							value={value}
							type='text'
							name='columnName'
							onChange={e => onChange(e.target.value)}
							placeholder='Column name'
							onKeyDown={handleKeyDown}
						/>
					</DialogDescription>
				</DialogHeader>

				<Button variant={'default'} onClick={onClick}>
					{btnText}
				</Button>
			</DialogContent>
		</Dialog>
	)
}
