import { UserType } from "./enums"

export interface User{
    type: UserType | string
    id: string
    displayName: string
    email: string
}

export interface Products{
    id: number,
    name: string,
    description: string[],
    price: number,
    tags: string[],
    img_src: string,
    isDeal: boolean
}
