import { Root } from './root.types'

export interface User extends Root {
	name?: string,
	email: string,
	password: string,
	role: UserRole,
};

export enum UserRole {
	user,
	admin
}