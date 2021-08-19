import { AccountBalance, People, Receipt } from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
import { LABELS, URIS } from './global'
import { Header } from './Header'
import { DrawerList } from './type'

type PageProps = {
    role: string
    children: any
}

export const Page = ({role, children}: PageProps) => {

    const history = useHistory()

    const AdminPage = () => {
        const drawerList: DrawerList[] = [
            {
                name: LABELS.USERS,
                icon: <People/>,
                onClick: () => {history.push(URIS.USERS)},
                url: '/users',
                headerTitle: 'Users'
            },
            {
                name: LABELS.INVENTORY,
                icon: <Receipt/>,
                onClick: () => {history.push(URIS.PRODUCTS)},
                url: '/products',
                headerTitle: 'Products'
            },
        ]

        return (
            <Header drawerList={drawerList}>
                {children}
            </Header>
        )
    }

    const StaffPage = () => {
        const drawerList: DrawerList[] = [
            {
                name: LABELS.INVENTORY,
                icon: <AccountBalance/>,
                onClick: () => {history.push(URIS.INVENTORY)},
                url: '/inventory',
                headerTitle: 'Inventories'
            },
        ]

        return (
            <Header drawerList={drawerList}>
                {children}
            </Header>
        )
    }

    return (
        <>
            {role === 'ADMIN' && <AdminPage/>}
            {role === 'STAFF' && <StaffPage/>}
        </>
    )
}