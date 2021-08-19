import axios from 'axios'
import { handleResponse } from './handle-response'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
})

export const doGet = async (endpoint: string) => {
    return await axiosInstance.get(endpoint)
        .then(handleResponse)
}

export const doPost = async (endpoint: string, data: any) => {
    return await axiosInstance.post(endpoint, data)
        .then((res) => {
            if (res.status !== 201)
                throw new Error('Not Created')
        })
}

export const doPut = async (endpoint: string, data: any) => {
    return await axiosInstance.put(endpoint, data)
}

export const doDelete = async (endpoint: string) => {
    return await axiosInstance.delete(endpoint)
}