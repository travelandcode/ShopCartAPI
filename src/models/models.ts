import { UserType } from "./enums"

export interface User{
    type: UserType
    id: string
    displayName: string
}