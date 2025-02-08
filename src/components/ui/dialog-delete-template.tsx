import { Trash2 } from 'lucide-react'
import { Button } from './button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './dialog'

interface DialogDeleteTemplateProps {
	description: string
	onClick: () => void
	children: React.ReactNode
}

export default function DialogDeleteTemplate({
	description,
	onClick,
	children,
}: DialogDeleteTemplateProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>
			<DialogContent
				aria-describedby='modal-content'
				className='sm:max-w-[425px]'
			>
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
				</DialogHeader>
				<DialogDescription>{description}</DialogDescription>

				<Button variant='destructive' onClick={onClick}>
					Delete
				</Button>
			</DialogContent>
		</Dialog>
	)
}
