import { doDelete, doGet, doPost, doPut } from '../helpers/request-helper'
import { Product } from '../pages/type'

const baseURL = '/api/products'

const getAllProducts = async () => {
    return doGet(baseURL)
}

const deleteProduct = async (id: number) => {
    return doDelete(`${baseURL}/${id}`)
}

const addProduct = async (product: Product) => {
    return doPost(`${baseURL}`, product)
}

const getProduct = async (id: number) => {
    return doGet(`${baseURL}/${id}`)
}

const updateProduct = async (id: number, product: Product) => {
    return doPut(`${baseURL}/${id}`, product)
}

const getAllProductsWithInventory = async () => {
    return doGet(`${baseURL}/withinventory`)
}

const getProductWithInventory = async (id: number) => {
    return doGet(`${baseURL}/${id}/withinventory`)
}

export const productService = {
    addProduct,
    deleteProduct,
    getAllProducts,
    getAllProductsWithInventory,
    getProduct,
    getProductWithInventory,
    updateProduct
}