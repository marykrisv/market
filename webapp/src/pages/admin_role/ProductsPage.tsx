import { createTheme, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Modal, Paper, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Visibility } from '@material-ui/icons'
import { useEffect, useState } from 'react'
import { inventoryService } from '../../services/InventoryService'
import { productService } from '../../services/ProductService'
import { ActiveChip } from '../../styled-mui-custom'
import { AppModal, AppTableTheme, modalStyles, SimpleCrudPage } from '../common/SimpleCrudPage'
import { TABLE_HEADERS } from '../global'
import { Inventory, Product, ProductWithInventory } from '../type'

export const ProductsPage = () => {
    const theme = createTheme({
        palette: {
            secondary: {
                main: '#0B5085',
            },
            background: {
                default: '#F4F6F8',
            },
        },
        overrides: {
            MuiTabs: {
                root: {
                    borderBottom: '1px solid rgba(196, 196, 196, 0.5)',
                    backgroundColor: '#c7ecee'
                },
            },
            MuiTableCell: {
                head: {
                    color: '#5F5F5F',
                    fontWeight: 'normal',
                    borderBottom: 'none',
                },
            },
            MuiTableContainer: {
                root: {
                    boxShadow: 'none',
                },
            },
        },
    })

    const AllProductList = () => {
        const [products, setProducts] = useState<ProductWithInventory[]>()

        const [openModal, setOpenModal] = useState<boolean>(false)
        const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')

        const [selectedProductToEdit, setSelectedProductToEdit] = useState<Product>()
        const [selectedProductId, setSelectedProductId] = useState<number>()

        const [openInventoryModal, setOpenInventoryModal] = useState<boolean>(false)

        const handleModalOpen = (mode: 'add' | 'edit', selectedId?: number) => {
            setOpenModal(true)
            setModalMode(mode)

            if (selectedId) {
                productService.getProduct(selectedId).then(setSelectedProductToEdit)
            }
        }

        useEffect(() => {
            getAllProducts()
        }, [])

        useEffect(() => {
            setOpenModal(false)
        }, [products])

        const deleteProduct = (id: number) => {
            productService.deleteProduct(id).then(res => {
                getAllProducts()
                alert(res.data)
            }).catch((res) => alert(res.data))
        }

        const getAllProducts = () => {
            productService.getAllProductsWithInventory().then(setProducts)
        }
        
        const AppModalProduct = () => {
            const [name, setName] = useState<string>('')
            const [description, setDescription] = useState<string>('')
            const [category, setCategory] = useState<string>('')
            const [disabled, setDisabled] = useState<boolean>(false)

            useEffect(() => {
                if (modalMode === 'edit' && selectedProductToEdit) {
                    setName(selectedProductToEdit.name)
                    setDescription(selectedProductToEdit.description)
                    setCategory(selectedProductToEdit.category)
                    setDisabled(selectedProductToEdit.disabled)
                }
            }, [])

            const isAllValuesValid = (): boolean => {
                let valid = true
                const EMPTY_STRING = ''

                if (name.trim() === EMPTY_STRING) valid = false
                if (description.trim() === EMPTY_STRING) valid = false
                if (category.trim() === EMPTY_STRING) valid = false

                return valid
            }

            return (
                <AppModal
                    open={openModal} 
                    mode={modalMode}
                    title={'Products'} 
                    handleModalClose={() => setOpenModal(false)}
                    isAllValuesValid={isAllValuesValid()}
                    formBody={
                        <div className={'modal-middle-container'}>
                            <FormControl fullWidth={true} variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={category}
                                    onChange={(event) => setCategory(event.target.value as string)}
                                    label="Category"
                                    >
                                    <MenuItem value={'Dry Goods'}>Dry Goods</MenuItem>
                                    <MenuItem value={'Medicine'}>Medicine</MenuItem>
                                    <MenuItem value={'Utensils'}>Utensils</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl 
                                fullWidth={true}
                                className={'form-text-field-control'} 
                                margin={'normal'} 
                                component={'div'}>
                                <TextField
                                    value={name}
                                    label={'Name'}
                                    variant={'outlined'}
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </FormControl>
                            <FormControl 
                                    fullWidth={true}
                                    className={'form-text-field-control'} 
                                    margin={'normal'} 
                                    component={'div'}>
                                <TextField
                                    value={description}
                                    label={'Description'}
                                    variant={'outlined'}
                                    onChange={(event) => setDescription(event.target.value)}
                                />
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={disabled}
                                        onChange={() => setDisabled(!disabled)}
                                        color='primary'
                                    />
                                }
                                label='Disable'
                            />
                        </div>
                    }
                    handleSubmit={() => {
                        const product: Product = {
                            name: name,
                            description: description,
                            category: category,
                            disabled: disabled
                        }

                        if (modalMode === 'add') {
                            productService.addProduct(product).then(() => {
                                alert('Product successfully added!')
                                getAllProducts()
                            })
                        } else {
                            if (selectedProductToEdit && selectedProductToEdit.id) {
                                const id = selectedProductToEdit.id

                                productService.updateProduct(id, product).then(() => {
                                    alert('Product successfully updated!')
                                    getAllProducts()
                                })
                            }
                        }
                    }}
                />
            )
        }

        const InventoryModal = () => {
            const classes = modalStyles()

            const [inventories, setInventories] = useState<Inventory[]>([])

            useEffect(() => {
                selectedProductId && inventoryService.getInventoryByProdId(selectedProductId).then(setInventories)
            }, [])
            
            return (
                <Modal
                    open={openInventoryModal}
                    onClose={() => setOpenInventoryModal(false)}
                    aria-labelledby={'simple-modal-title'}
                    aria-describedby={'simple-modal-description'}
                >
                    <div className={'modal-container inventory'}>
                        <div className={classes.modalTitle}>
                            Inventory Transactions
                        </div>
                        <div className={'modal-middle-container'}>
                        <MuiThemeProvider theme={AppTableTheme}>
                            <Paper elevation={0} variant={'outlined'} square>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell key={'transaction'}>Transaction</TableCell>
                                                <TableCell key={'details'}>Details</TableCell>
                                                <TableCell key={'qty'}>Quantity</TableCell>
                                                <TableCell key={'date'}>Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {inventories.map((inventory: Inventory, index) =>
                                                <TableRow key={index}>
                                                    <TableCell key={'transaction'}>{inventory.transaction}</TableCell>
                                                    <TableCell key={'transaction'}>{inventory.details}</TableCell>
                                                    <TableCell key={'transaction'}>{inventory.quantity}</TableCell>
                                                    <TableCell key={'transaction'}>{inventory.created_at}</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </MuiThemeProvider>
                        </div>
                    </div>
                </Modal>
            )
        }

        return (
            <>
                {products &&
                    <SimpleCrudPage<ProductWithInventory>
                        title={'Products'}
                        tableRows={products}
                        columnHeaders={
                            [
                                TABLE_HEADERS.NAME,
                                TABLE_HEADERS.DESCRIPTION,
                                TABLE_HEADERS.CATEGORY,
                                TABLE_HEADERS.STATUS,
                                TABLE_HEADERS.TOTAL_QUANTITY,
                                TABLE_HEADERS.SHOW_INVENTORY,
                            ]
                        }
                        renderRow={(product: ProductWithInventory) =>
                            <>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>
                                    <ActiveChip
                                        color={product.disabled ? 'default' : 'primary'}
                                        label={product.disabled ? 'Disabled' : 'Active'}
                                    />
                                </TableCell>
                                <TableCell>{product.total === null ? 0 : product.total}</TableCell>
                                <TableCell>
                                    <IconButton color={'primary'} onClick={() => {
                                        setOpenInventoryModal(true)
                                        setSelectedProductId(product.id)
                                        }}>
                                        <Visibility/>
                                    </IconButton>
                                </TableCell>
                            </>
                        }
                        appModal={<AppModalProduct/>}
                        deleteAction={deleteProduct}
                        handleModalOpen={handleModalOpen}
                    />
                }
                <InventoryModal/>
            </>
        )
    }

    return (
        <MuiThemeProvider theme={theme}>
            <div className={'admin__content'}>
                <AllProductList/>
            </div>
        </MuiThemeProvider>
    )
}