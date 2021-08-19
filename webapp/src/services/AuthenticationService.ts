import { createBrowserHistory } from 'history'
import { BehaviorSubject } from 'rxjs'
import { handleResponse } from '../helpers/handle-response'
import { axiosInstance } from '../helpers/request-helper'
import { URIS } from '../pages/global'

const history = createBrowserHistory()

const currentRole = new BehaviorSubject(JSON.parse(localStorage.getItem('currentRole')!))

const login = (username: string, password: string) => {
    return axiosInstance.post('/api/users/login', {
        username: username,
        password: password
    })
    .then(handleResponse)
    .then(response => {
        const role = response.role
        localStorage.setItem('currentRole', JSON.stringify(role))
        currentRole.next(role)
        return response
    })
}

const logout = (redirectUri: string = URIS.LOGIN) => {
    localStorage.removeItem('currentRole')
    redirectUri && history.push(redirectUri)
    window.location.reload()
}

const userRole = (): string | undefined => {
    if (currentRole.value === null) {
        return undefined
    }

    if (currentRole.value) {
        return currentRole.value
    }

    return undefined
}

export const authenticationService = {
    login,
    logout,
    userRole
}