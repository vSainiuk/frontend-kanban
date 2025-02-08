import { HEIGHT } from '@/constants/height-elements.constants'
import UploadImageButton from '../UploadImageButton'
import { useProfile } from '@/hooks/useProfile'

export default function Header() {
	const { data } = useProfile()
	const user = data?.user
	return (
		<header
			className='bg-card rounded-b-2xl p-2'
			style={{ height: `${HEIGHT.header}` }}
		>
			<UploadImageButton user={user} />
		</header>
	)
}
