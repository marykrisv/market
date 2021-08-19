import {
    Button,
    createTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    makeStyles,
    Modal,
    MuiThemeProvider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@material-ui/core'
import { Add } from '@material-ui/icons'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { useState } from 'react'
import { LABELS, TABLE_HEADERS } from '../global'
import './SimpleCrudPage.scss'

export const AppTableTheme = createTheme({
    overrides: {
        MuiTableCell: {
            root: {
                fontSize: '16px',
            },
            head: {
                fontWeight: 'bold',
                fontSize: '14px',
            },
        },
        MuiTableHead: {
            root: {
                backgroundColor: '#F2F4F7',
                border: 'none'
            }
        },
        MuiPaper: {
            root: {
                margin: '10px',
            }
        },
    },
})

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

export const modalStyles = () => makeStyles((theme) => ({
    modalTitle: {
        fontSize: '30px',
        fontWeight: 500,
        color: 'primary'
    }
}))()

type SimpleCrudPageProps<T> = {
    tableRows: any[]
    columnHeaders: string[]
    renderRow: (element: T) => JSX.Element
    appModal: JSX.Element
    title: string
    deleteAction: (id: number) => void
    handleModalOpen: (mode: 'add' | 'edit', selectedId?: number) => void
}

export const SimpleCrudPage = <T extends unknown>({tableRows, columnHeaders, renderRow, appModal, title, deleteAction, handleModalOpen}: SimpleCrudPageProps<T>) => {
    const classes = simpleCrudPageStyles()


    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [selectedId, setSelectedId] = useState<number>()

    const handleDelete = () => {
        if (selectedId) {
            deleteAction(selectedId)
            setOpenDialog(false)
        }
        
    }

    const handleDialogClose = () => {
        setOpenDialog(false)
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
                                <TableCell key={'action'} className={classes.columnTitle}>{TABLE_HEADERS.ACTIONS}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.map((row: any, index) =>
                                <TableRow key={index}>
                                    {renderRow(row)}
                                    <TableCell>
                                        <IconButton color={'primary'} onClick={() => handleModalOpen('edit', row.id)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color={'secondary'} onClick={() => {
                                                setSelectedId(row.id)
                                                setOpenDialog(true)}
                                            }>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {appModal}
                <ConfirmDialog/>
            </Paper>
        </MuiThemeProvider>
    )

    const ConfirmDialog = () => (
        <div>
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby={'alert-dialog-title'}
                aria-describedby={'alert-dialog-description'}
            >
                <DialogTitle id={'alert-dialog-title'}>{`Are you sure you want to delete this ${title}?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`WARNING: This ${title} will be permanently deleted in the database!`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )

    return (
        <>
            {tableRows &&
                <div>
                    <div className={classes.otherFunctions}>
                        <Button
                            variant={'contained'}
                            color={'secondary'}
                            startIcon={<Add />}
                            onClick={() => handleModalOpen('add')}
                        >
                            {LABELS.ADD}
                        </Button>
                    </div>
                    <BasicTable/>
                </div>
            }
        </>
    )
}

export const AppModal = ({open, mode, title, formBody, handleModalClose, handleSubmit, isAllValuesValid}:
    {open: boolean, 
        mode: 'add' | 'edit', 
        title: string, 
        formBody: JSX.Element, 
        handleModalClose: () => void, 
        handleSubmit: () => void,
        isAllValuesValid: boolean
    }) => {

    const classes = modalStyles()

    return (
        <Modal
            open={open}
            onClose={handleModalClose}
            aria-labelledby={'simple-modal-title'}
            aria-describedby={'simple-modal-description'}
        >
            <div className={'modal-container'}>
                <div className={classes.modalTitle}>
                    {mode === 'add' ? `Add ${title}` : `Edit ${title}`}
                </div>
                <div className={'modal-middle-container'}>
                    <form>
                        {formBody}
                    </form>
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
                        disabled={!isAllValuesValid}
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