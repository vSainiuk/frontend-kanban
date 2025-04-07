import { useKanbanBoards } from '@/app/a/tasks-lite/hooks/useKanbanBoards'
import { useUpdateKanbanBoard } from '@/app/a/tasks-lite/hooks/useUpdateKanbanBoard'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { COLORS } from '@/constants/colors.constants'
import { cn } from '@/lib/utils'
import { kanbanBoardService } from '@/services/kanban-board.service'
import { KanbanBoard } from '@/types/kanban-board.type'
import cuid from 'cuid'
import { Loader2, Plus } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const Chrome = dynamic(() => import('@uiw/react-color-chrome'), { ssr: false })

export default function BoardList() {
	const pathname = usePathname()
	const router = useRouter()
	const { kanbanBoards, refetch: refetchBoards, isPending } = useKanbanBoards()
	const { updateKanbanBoard } = useUpdateKanbanBoard()

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [currentBoardId, setCurrentBoardId] = useState<string | null>(null)
	const [newTitle, setNewTitle] = useState('')
	const [removingBoard, setRemovingBoard] = useState<string | null>(null)

	// #region Color picker
	const [isDialogColorPickerOpen, setIsDialogColorPickerOpen] = useState(false)
	const [colorPickerValue, setColorPickerValue] = useState({
		h: 0,
		s: 0,
		v: 100,
		a: 1,
	})
	const [selectedColorHex, setSelectedColorHex] = useState('#ffffff')
	// #endregion

	const onAddNewBoard = async () => {
		const slug = cuid()

		console.log(slug)

		try {
			await kanbanBoardService.createKanbanBoard({ slug })

			router.push(`/a/tasks-lite/${slug}`)
		} catch (error) {
			console.error(error)
		}
	}

	const onUpdateBoard = async (id: string) => {
		if (!newTitle) return
		const data = {
			title: newTitle.trim(),
		}
		try {
			updateKanbanBoard({
				id,
				data,
			})

			setNewTitle('')
			setIsDialogOpen(false)
		} catch (error) {}
	}

	const onDeleteBoard = async (id: string, slug: string) => {
		setRemovingBoard(id)

		try {
			await kanbanBoardService.removeKanbanBoard(id)

			const redirectUrl = getRedirectUrlAfterBoardDeletion(
				slug,
				pathname,
				kanbanBoards,
				'/a/tasks-lite'
			)

			if (redirectUrl) {
				router.push(redirectUrl)
			}

			refetchBoards()
		} catch (error) {
		} finally {
			setRemovingBoard(null)
		}
	}

	if (kanbanBoards?.length === 0 || !kanbanBoards) return null

	return (
		<>
			<ul className='flex flex-col gap-[3px] px-0.5 bg-card/75 rounded'>
				{kanbanBoards.map(board => {
					const isBoardActive = pathname === `/a/tasks-lite/${board.slug}`
					const isRemoving = removingBoard === board.id
					return (
						<li
							key={board.id}
							style={{ backgroundColor: board.icon_color || COLORS.secondary }}
							className={cn(
								`w-10 h-10 flex justify-center items-center rounded  transition-all duration-200 cursor-pointer relative`,
								isBoardActive ? 'scale-110' : 'hover:scale-110'
							)}
						>
							{isRemoving && <Loader2 className='animate-spin' />}

							{!isRemoving && (
								<ContextMenu>
									<ContextMenuTrigger asChild>
										<Link
											className='block w-full h-full'
											href={`${board.slug}`}
										/>
									</ContextMenuTrigger>
									<ContextMenuContent>
										<ContextMenuSub>
											<ContextMenuSubTrigger>Update</ContextMenuSubTrigger>
											<ContextMenuSubContent>
												<ContextMenuItem
													onClick={() => {
														setCurrentBoardId(board.id)
														setNewTitle(board.title || '')
														setIsDialogOpen(true)
													}}
												>
													Name of the board
												</ContextMenuItem>
												<ContextMenuItem disabled onClick={() => {}}>
													Background image
												</ContextMenuItem>
												<ContextMenuItem
													onClick={() => {
														setCurrentBoardId(board.id)
														setSelectedColorHex(board.icon_color || '#ffffff')
														setIsDialogColorPickerOpen(true)
													}}
												>
													Board icon color
												</ContextMenuItem>
											</ContextMenuSubContent>
										</ContextMenuSub>
										<ContextMenuSeparator />
										<ContextMenuItem
											onClick={() => onDeleteBoard(board.id, board.slug)}
										>
											Delete
										</ContextMenuItem>
									</ContextMenuContent>
								</ContextMenu>
							)}
						</li>
					)
				})}

				<li className='flex items-center justify-center w-10 h-10 rounded group cursor-pointer'>
					<Plus
						onClick={onAddNewBoard}
						className='w-6 h-6 group-hover:scale-150 transition-all duration-200'
					/>
				</li>
			</ul>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogTrigger asChild>
					<button className='hidden'>Open Dialog</button>
				</DialogTrigger>
				<DialogContent className='max-w-screen-sm'>
					<DialogHeader>
						<DialogTitle>Update Board Name</DialogTitle>
						<DialogDescription>
							Enter the new name for the board.
						</DialogDescription>
					</DialogHeader>
					<Input
						type='text'
						value={newTitle}
						onChange={e => setNewTitle(e.target.value)}
						placeholder='Board name'
						className='border p-2 mb-4 w-full'
					/>
					<Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
					<Button onClick={() => onUpdateBoard(currentBoardId as string)}>
						Save
					</Button>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isDialogColorPickerOpen}
				onOpenChange={setIsDialogColorPickerOpen}
			>
				<DialogTrigger asChild>
					<button className='hidden'>Open Color Picker</button>
				</DialogTrigger>
				<DialogContent className='max-w-screen-sm'>
					<DialogHeader>
						<DialogTitle>Change Board Icon Color</DialogTitle>
						<DialogDescription>
							Select a new color for the icon board.
						</DialogDescription>
					</DialogHeader>

					<div className='flex items-center gap-5'>
						{/* Color Picker */}
						<Chrome
							color={colorPickerValue}
							style={{
								marginBottom: '20px',
								backgroundColor: '#322d37',
								padding: '10px',
								borderRadius: '8px',
							}}
							onChange={color => {
								setColorPickerValue(color.hsva)
								import('@uiw/color-convert').then(({ hsvaToHex }) => {
									setSelectedColorHex(hsvaToHex(color.hsva))
								})
							}}
						/>

						<div
							style={{
								background: selectedColorHex,
								width: 50,
								height: 50,
								borderRadius: 8,
								margin: '20px auto',
								boxShadow: '0 0 8px rgba(0,0,0,0.3)',
							}}
						/>
					</div>

					<Button onClick={() => setIsDialogColorPickerOpen(false)}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							if (currentBoardId && selectedColorHex) {
								updateKanbanBoard({
									id: currentBoardId,
									data: {
										icon_color: selectedColorHex,
									},
								})
							}
							setIsDialogColorPickerOpen(false)
						}}
					>
						Save
					</Button>
				</DialogContent>
			</Dialog>
		</>
	)
}

function getRedirectUrlAfterBoardDeletion(
	deletedBoardSlug: string,
	currentPath: string,
	kanbanBoards: KanbanBoard[] | undefined,
	fallbackUrl: string
): string | null {
	const deletedPath = `/a/tasks-lite/${deletedBoardSlug}`

	if (!kanbanBoards) return null

	if (currentPath !== deletedPath) {
		return null
	}

	const deletedIndex = kanbanBoards.findIndex(b => b.slug === deletedBoardSlug)

	const remainingBoards = kanbanBoards.filter(b => b.slug !== deletedBoardSlug)

	if (remainingBoards.length === 0) {
		return fallbackUrl
	}

	const targetIndex = deletedIndex > 0 ? deletedIndex - 1 : 0
	const targetBoard = remainingBoards[targetIndex]

	return `/a/tasks-lite/${targetBoard.slug}`
}
