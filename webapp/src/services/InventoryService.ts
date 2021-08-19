import { doGet, doPost } from '../helpers/request-helper'
import { Inventory } from '../pages/type'

const baseURL = '/api/inventory'

const getInventoryByProdId = async (id: number) => {
    return doGet(`${baseURL}?productid=${id}`)
}

const addInventory = async (inventory: Inventory) => {
    return doPost(baseURL, inventory)
}

export const inventoryService = {
    addInventory,
    getInventoryByProdId
}