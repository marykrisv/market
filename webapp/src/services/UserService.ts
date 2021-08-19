import { doDelete, doGet, doPost, doPut } from '../helpers/request-helper'
import { AppUser } from '../pages/type'

const baseURL = '/api/users'

const getAllUsers = async () => {
    return doGet(baseURL)
}

const deleteUser = async (id: number) => {
    return doDelete(`${baseURL}/${id}`)
}

const addUser = async (user: AppUser) => {
    return doPost(`${baseURL}`, user)
}

const getUser = async (id: number) => {
    return doGet(`${baseURL}/${id}`)
}

const updateUser = async (id: number, user: AppUser) => {
    return doPut(`${baseURL}/${id}`, user)
}

export const userService = {
    addUser,
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}