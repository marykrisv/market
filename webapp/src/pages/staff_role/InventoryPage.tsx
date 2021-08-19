import { Button, FormControl, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core'
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles'
import { Add, Remove, ShoppingCart } from '@material-ui/icons'
import { useEffect, useState } from 'react'
import { inventoryService } from '../../services/InventoryService'
import { productService } from '../../services/ProductService'
import { AppTableTheme, modalStyles } from '../common/SimpleCrudPage'
import { LABELS } from '../global'
import { Inventory, ProductWithInventory } from '../type'

const simpleCrudPageStyles = () => makeStyles((theme) => ({
    columnTitle: {
        color: '#2980b9'
    },
    otherFunctions: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '10px'
    },
}))()

export const InventoryPage = () => {

    const classes = simpleCrudPageStyles()

    const [products, setProducts] = useState<ProductWithInventory[]>([])

    const [openModal, setOpenModal] = useState<boolean>(false)
    const [modalMode, setModelMode] = useState<'Purchase'|'Breakage'|'Sold'>('Purchase')

    const [selectedProductId, setSelectedProductId] = useState<number>()

    useEffect(() => {
        getAllInventory()
    }, [])

    useEffect(() => {
        setOpenModal(false)
    }, [products])

    const getAllInventory = () => {
        productService.getAllProductsWithInventory().then(setProducts)
    }

    const columnHeaders = [
        'Name',
        'Description',
        'Category',
        'Total Count',
        'Actions'
    ]

    const handleModalClose = () => {
        setOpenModal(false)
    }

    const handleModalOpen = (mode: 'Purchase'|'Breakage'|'Sold', selectedId?: number) => {
        if (selectedId) {
            setOpenModal(true)
            setModelMode(mode)
            setSelectedProductId(selectedId)
        }
    }

    const InventoryModal = () => {
        const classes = modalStyles()

        const [currentQuantity, setCurrentQuantity] = useState<number>(0)
        const [quantity, setQuantity] = useState<number>(0)
        const [details, setDetails] = useState<string>('')

        useEffect(() => {
            selectedProductId && productService.getProductWithInventory(selectedProductId)
                .then(res => setCurrentQuantity(res.total === null ? 0 : res.total))
        }, [])
        
        const isValueValid = () => {
            let valid = true

            if (quantity === 0) valid = false

            if (modalMode === 'Breakage' || modalMode === 'Sold') {
                if (quantity > currentQuantity) valid = false
            }

            return valid
        }

        const handleSubmit = () => {
            if (selectedProductId) {
                let finalQty = quantity
                if (modalMode === 'Breakage' || modalMode === 'Sold') {
                    finalQty = quantity * -1
                }
    
                const inventory: Inventory = {
                    productid: selectedProductId,
                    transaction: modalMode,
                    details: details,
                    quantity: finalQty
                }
    
                inventoryService.addInventory(inventory).then(res => {
                    alert("Inventory successfully Added!")
                    getAllInventory()
                })
            }
        }
        
        return (
            <Modal
                open={openModal}
                onClose={handleModalClose}
                aria-labelledby={'simple-modal-title'}
                aria-describedby={'simple-modal-description'}
            >
                <div className={'modal-container'}>
                    <div className={classes.modalTitle}>
                        {modalMode}
                    </div>
                    <div className={'modal-middle-container'}>
                        <div>{`Current quantity: ${currentQuantity}`}</div>
                        <FormControl 
                            fullWidth={true}
                            className={'form-text-field-control'} 
                            margin={'normal'} 
                            component={'div'}>
                            <TextField
                                value={quantity}
                                label={'Quantity'}
                                variant={'outlined'}
                                type={'number'}
                                onChange={(event) => setQuantity(parseInt(event.target.value))}
                            />
                        </FormControl>
                        <FormControl 
                            fullWidth={true}
                            className={'form-text-field-control'} 
                            margin={'normal'} 
                            component={'div'}>
                            <TextField
                                value={details}
                                label={'Details'}
                                variant={'outlined'}
                                onChange={(event) => setDetails(event.target.value)}
                            />
                        </FormControl>
                    </div>
                    <div className={'modal-buttons-container'}>
                        <Button
                            variant={'contained'}
                            color={'default'}
                            className={'modal-button'}
                            onClick={handleModalClose}
                        >
                            {LABELS.CLOSE}
                        </Button>
                        <Button
                            disabled={!isValueValid()}
                            variant={'contained'}
                            color={'primary'}
                            className={'modal-button'}
                            onClick={handleSubmit}
                        >
                            {LABELS.SUBMIT}
                        </Button>
                    </div>
                </div>
            </Modal>
        )
    }

    const BasicTable = () => (
        <MuiThemeProvider theme={AppTableTheme}>
            <Paper elevation={0} variant={'outlined'} square>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columnHeaders.map((header, index) =>
                                    <TableCell key={index} className={classes.columnTitle}>{header}</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((row: ProductWithInventory, index) =>
                                <TableRow key={index}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.total === null ? 0 : row.total}</TableCell>
                                    <TableCell>
                                        <IconButton 
                                            aria-label={'delete'} 
                                            color={'primary'} 
                                            onClick={() => handleModalOpen('Purchase', row.id)}>
                                            <Add />
                                        </IconButton>
                                        <IconButton 
                                            aria-label={'delete'} 
                                            color={'primary'} 
                                            onClick={() => handleModalOpen('Breakage', row.id)}>
                                            <Remove />
                                        </IconButton>
                                        <IconButton 
                                            aria-label={'delete'} 
                                            color={'primary'} 
                                            onClick={() => handleModalOpen('Sold', row.id)}>
                                            <ShoppingCart />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <InventoryModal/>
                    </Table>
                </TableContainer>
            </Paper>
        </MuiThemeProvider>
    )

    return (
        <>
            {products &&
                <div>
                    <BasicTable/>
                </div>
            }
        </>
    )
}