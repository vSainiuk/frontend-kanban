import { AuthForm } from '@/types/auth.types'
import { RegisterOptions } from 'react-hook-form'

const schemaPassword: RegisterOptions<AuthForm, 'password'> = {
	required: 'Password is required',
	minLength: {
		value: 6,
		message: 'Password must be at least 6 characters',
	},
	maxLength: {
		value: 32,
		message: 'Password must be at most 32 characters',
	},
}

const schemaEmail: RegisterOptions<AuthForm, 'email'> = {
	required: 'Email is required',
	pattern: {
		value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
		message: 'Invalid email address',
	},
}

export { schemaPassword, schemaEmail }