'use client'

import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Loader from '@/components/ui/loader'
import { DASHBOARD_PAGES } from '@/config/pages-url.config'
import { authService } from '@/services/auth.service'
import { AuthForm } from '@/types/auth.types'
import { ErrorMessage } from '@hookform/error-message'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { schemaEmail, schemaPassword } from './validation-form'

export default function Auth() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<AuthForm>({
		mode: 'onChange',
	})

	const [isLoginForm, setIsLoginForm] = useState(false)
	const { push } = useRouter()
	const { mutate, isPending } = useMutation({
		mutationKey: ['auth'],
		mutationFn: async (data: AuthForm) => {
			try {
				const response = await authService.main(
					isLoginForm ? 'login' : 'register',
					data
				)
				return response
			} catch (error: any) {
				if (error.response.data.message) {
					throw new Error(error.response.data.message)
				} else {
					throw new Error('An unexpected error occurred')
				}
			}
		},
		onSuccess: () => {
			toast.success('Successfully logged in')
			reset()
			push(DASHBOARD_PAGES.HOME)
		},
		onError: ({ message }) => {
			toast.error(message)
		},
	})

	const onSubmit: SubmitHandler<AuthForm> = async data => {
		mutate(data)
	}

	useEffect(() => {
		if (isPending) {
			const timeout = setTimeout(() => {
				toast.warning('Login is taking longer than usual... Please wait.', {
					duration: 5000,
				})
			}, 5000)

			return () => clearTimeout(timeout)
		}
	}, [isPending])

	return (
		<div className='flex min-h-screen bg-auth-pattern bg-no-repeat bg-cover px-2'>
			<form
				className='w-full sm:w-1/2 lg:w-1/4 m-auto shadow bg-sidebar/40 rounded-xl'
				onSubmit={handleSubmit(onSubmit)}
				method='POST'
			>
				<div className='flex flex-col items-center gap-4 justify-center p-4'>
					<Heading classNames='select-none'>Auth</Heading>

					<div className='relative flex flex-col gap-3 w-full'>
						<Input
							{...register('email', schemaEmail)}
							placeholder='Enter your email'
							id='email'
							type='email'
							autoComplete='on'
							disabled={isPending}
							aria-invalid={errors.email ? 'true' : 'false'}
						/>

						<Input
							{...register('password', schemaPassword)}
							placeholder='Enter your password'
							id='password'
							type='password'
							autoComplete='on'
							disabled={isPending}
							aria-invalid={errors.password ? 'true' : 'false'}
						/>

						<ErrorMessageTemplate name='email' errors={errors} />
						<ErrorMessageTemplate name='password' errors={errors} />

						{isPending && <Loader position='center' />}
					</div>

					<div className='flex items-center gap-3'>
						<Button disabled={isPending} onClick={() => setIsLoginForm(true)}>
							Login
						</Button>
						<Button disabled={isPending} onClick={() => setIsLoginForm(false)}>
							Register
						</Button>
					</div>
				</div>
			</form>
		</div>
	)
}

const ErrorMessageTemplate = ({
	name,
	errors,
}: {
	name: keyof AuthForm
	errors: FieldErrors<AuthForm>
}) => (
	<ErrorMessage
		errors={errors}
		name={name}
		render={({ message }) => (
			<div className='mt-2 text-xs text-red-600 p-1 bg-red-50 border-l-4 border-red-500 rounded-md'>
				<span>{message}</span>
			</div>
		)}
	/>
)
