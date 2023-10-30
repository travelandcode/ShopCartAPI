import { UserType } from "./enums"

export interface User{
    type: UserType | string
    id: string
    displayName: string
    email: string
}