import { User } from './user.types'

export interface AuthForm {
	email: string;
	password: string;
}

export interface AuthResponse {
	access_token: string;
	user: User;
}

export type TypeUserForm = Omit<User, 'id'> & { password?: string; }