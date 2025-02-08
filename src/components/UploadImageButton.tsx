import allowedTypesImages from '@/constants/allowedTypesImages'
import { useOutside } from '@/hooks/useOutside'
import { useUpdateProfile } from '@/hooks/useUpdateProfile'
import { User } from '@/types/user.types'
import { saveImageToS3 } from '@/utils/sendImageToS3'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, CircleDashedIcon, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import DialogDeleteTemplate from './ui/dialog-delete-template'
import { Input } from './ui/input'

export default function UploadImageButton({
	user,
}: {
	user: User | undefined
}) {
	const { updateProfile } = useUpdateProfile()
	const [image, setImage] = useState<File | null>(null)
	const [isUploading, setIsUploading] = useState(false)
	const isExistBackgroundImage = Boolean(user?.backgroundImageUrl)
	const { ref, isShow, setIsShow } = useOutside(false)

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files ? event.target.files[0] : null
		if (file) {
			setImage(file)
		}
	}

	const handleUpload = async () => {
		if (!image) return
		setIsUploading(true)

		try {
			const response = await saveImageToS3(image)

			updateProfile({
				backgroundImageUrl: response.data.url,
			})
		} catch (error: any) {
			toast.error(error.message || 'Failed to upload image')
		} finally {
			setIsUploading(false)
			setImage(null)
			setIsShow(false)
		}
	}

	useEffect(() => {
		if (!isShow) {
			setImage(null)
		}
	}, [isShow])

	return (
		<div
			ref={ref}
			className='flex items-center justify-end w-fit h-full ml-auto gap-1 px-2'
		>
			<AnimatePresence>
				{isShow && (
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
					>
						<Input
							className='h-full file:text-xs file:text-muted px-2 py-0.5'
							type='file'
							accept={allowedTypesImages.join(',')}
							onChange={handleFileChange}
							disabled={isUploading}
							onKeyDown={e => {
								if (e.key === 'Enter') {
									if (!image) return
									handleUpload()
								}
							}}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			{image && (
				<Button
					className='w-fit h-full rounded-full p-1'
					onClick={handleUpload}
					disabled={isUploading}
				>
					{isUploading ? (
						<CircleDashedIcon className='animate-spin w-2' />
					) : (
						<Check />
					)}
				</Button>
			)}

			{isExistBackgroundImage && !isShow && (
				<DialogDeleteTemplate
					description='Are you sure you want to delete the background image?'
					onClick={() => {
						updateProfile({
							backgroundImageUrl: '',
						})
					}}
				>
					<Trash2
						className={`${
							isExistBackgroundImage ? 'text-muted' : 'text-white'
						} w-4 h-4 mr-2 transition-colors hover:text-destructive cursor-pointer`}
					/>
				</DialogDeleteTemplate>
			)}

			<AnimatePresence>
				{!isShow && (
					<button
						onClick={() => setIsShow(true)}
						className='text-sm text-muted hover:text-white transition-colors '
					>
						<span>
							+ {isExistBackgroundImage ? 'Change' : 'Add'} background image
						</span>
					</button>
				)}
			</AnimatePresence>
		</div>
	)
}
