import { createTheme, MuiThemeProvider } from '@material-ui/core'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import './App.scss'
import { ProductsPage } from './pages/admin_role/ProductsPage'
import { UsersPage } from './pages/admin_role/UsersPage'
import { URIS } from './pages/global'
import { LoginPage } from './pages/no_role/LoginPage'
import { Page } from './pages/Page'
import { InventoryPage } from './pages/staff_role/InventoryPage'
import { authenticationService } from './services/AuthenticationService'

const theme = createTheme({
    palette: {
        primary: {
            main: '#1abc9c',
        },
        secondary: {
            main: '#d35400',
        },
    },
})

const NoRole = () => (
    <Switch>
        <Route path={URIS.LOGIN}>
            <LoginPage/>
        </Route>
        <Redirect to={URIS.LOGIN} />
    </Switch>
)

const AdminRole = () => (
    <Page role={'ADMIN'}>
        <BrowserRouter>
            <Switch>
                <Route path={URIS.USERS}>
                    <UsersPage/>
                </Route>
                <Route path={URIS.PRODUCTS}>
                    <ProductsPage/>
                </Route>
                <Redirect to={URIS.USERS} />
            </Switch>
        </BrowserRouter>
    </Page>
)

const StaffRole = () => (
    <Page role={'STAFF'}>
        <BrowserRouter>
            <Switch>
                <Route path={URIS.INVENTORY}>
                    <InventoryPage/>
                </Route>
                <Redirect to={URIS.INVENTORY} />
            </Switch>
        </BrowserRouter>
    </Page>
)

export const App = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <Switch>
                { authenticationService.userRole() === undefined && <NoRole/> }
                { authenticationService.userRole() === 'ADMIN' && <AdminRole/> }
                { authenticationService.userRole() === 'STAFF' && <StaffRole/> }
            </Switch>
        </MuiThemeProvider>
    )
}