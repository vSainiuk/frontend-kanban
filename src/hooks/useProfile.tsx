import { userService } from '@/services/user.service'
import { useQuery } from '@tanstack/react-query'

export function useProfile() {
	const { data, isPending } = useQuery({
		queryKey: ['profile'],
		queryFn: () => userService.getProfile(),
	})

	return {
		data,
		isPending,
	}
}
