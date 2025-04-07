import { useKanbanBoard } from '@/app/a/tasks-lite/hooks/useKanbanBoard'
import { HEIGHT } from '@/constants/height-elements.constants'
import { useProfile } from '@/hooks/useProfile'
import { useParams } from 'next/navigation'
import UploadImageButton from '../UploadImageButton'


export default function Header() {
	const { data } = useProfile()
	const { slug } = useParams()
	const currentSlug = Array.isArray(slug) ? slug[0] : slug
	const { kanbanBoard, refetch } = useKanbanBoard(currentSlug)

	const user = data?.user
	return (
		<header
			className='bg-card rounded-b-2xl p-2 flex justify-between items-center'
			style={{ height: `${HEIGHT.header}` }}
		>
			{slug && <h2 className='text-sm font-bold'>{kanbanBoard?.title}</h2>}
			<UploadImageButton user={user} />
		</header>
	)
}
