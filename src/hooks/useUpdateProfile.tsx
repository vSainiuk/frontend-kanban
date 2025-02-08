import { userService } from '@/services/user.service'
import { TypeUserPatchForm } from '@/types/auth.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateProfile() {
	const queryClient = useQueryClient();

	const { mutate: updateProfile, isPending } = useMutation({
		mutationKey: ['updateProfile'],
		mutationFn: (data: TypeUserPatchForm) => userService.updatePatchProfile(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['profile'],
			})
		},
	})

	return { updateProfile, isPending }
}