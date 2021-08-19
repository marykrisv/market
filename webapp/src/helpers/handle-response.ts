import {AxiosResponse} from 'axios'

export const handleResponse = (response: AxiosResponse): Promise<any> => {
    return response.data
}
