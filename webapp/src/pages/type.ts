export type UserDetails = {
    role: string
}

export type DrawerList = {
    name: string
    icon: JSX.Element
    onClick?: () => void
    url: string
    headerTitle: string
}

export type AppUser = {
    id?: number
    first_name: string
    last_name: string
    role: string
    username: string
    disabled: boolean
    password?: string
}

export type Product = {
    id?: number
    name: string
    description: string
    category: string
    disabled: boolean
}

export type ProductWithInventory = {
    total: number
} & Product

export type Inventory = {
    productid: number
    transaction: string
    details: string
    quantity: number
    created_at?: Date
}