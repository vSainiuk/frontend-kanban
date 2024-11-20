'use client'

import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DASHBOARD_PAGES } from '@/config/pages-url.config'
import { authService } from '@/services/auth.service'
import { AuthForm } from '@/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function Auth() {
	const { register, handleSubmit, reset } = useForm<AuthForm>({
		mode: 'onChange',
	})

	const [isLoginForm, setIsLoginForm] = useState(false)
	const { push } = useRouter()
	const { mutate } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: AuthForm) =>
			authService.main(isLoginForm ? 'login' : 'register', data),
		onSuccess: () => {
			toast.success('Successfully logged in')
			reset()
			push(DASHBOARD_PAGES.HOME)
		},
	})
	const onSubmit: SubmitHandler<AuthForm> = data => {
		mutate(data)
	}

	return (
		<div className='flex min-h-screen bg-auth-pattern bg-no-repeat bg-cover px-2'>
			<form
				className='w-full sm:w-1/2 lg:w-1/4 m-auto shadow bg-sidebar/40 rounded-xl'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='flex flex-col items-center gap-4 justify-center p-4'>
					<Heading>Auth</Heading>

					<div className='flex flex-col gap-3 w-full'>
						<Input
							{...register('email', { required: 'Email is missing!' })}
							placeholder='Enter your email'
							id='email'
							type='email'
						/>

						<Input
							{...register('password', { required: 'Password is missing!' })}
							placeholder='Enter your password'
							id='password'
							type='password'
						/>
					</div>

					<div className='flex items-center gap-3'>
						<Button onClick={() => setIsLoginForm(true)}>Login</Button>
						<Button onClick={() => setIsLoginForm(false)}>Register</Button>
					</div>
				</div>
			</form>
		</div>
	)
}
