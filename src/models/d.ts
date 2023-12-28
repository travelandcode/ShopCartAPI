export interface Product{
    id: number,
    name: string,
    description: string,
    price: number,
    tags: string[],
    img_src: string[],
    isDeal: boolean
}

export interface User{
    id: string,
    name: string,
    password: string,
    email: string,
    isEmailVerified: boolean
}

export interface Token{
    userId: string,
    token: string,
    createdAt: string,
    expiresAt: string
}
