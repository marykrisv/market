import { createTheme, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TableCell, TextField } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { useEffect, useState } from 'react'
import { userService } from '../../services/UserService'
import { ActiveChip } from '../../styled-mui-custom'
import { Utils } from '../../utils/Utils'
import { AppModal, SimpleCrudPage } from '../common/SimpleCrudPage'
import { TABLE_HEADERS } from '../global'
import { AppUser } from '../type'

export const UsersPage = () => {
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

    const AllUserList = () => {
        const [users, setUsers] = useState<AppUser[]>()

        const [openModal, setOpenModal] = useState<boolean>(false)
        const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')

        const [selectedUserToEdit, setSelectedUserToEdit] = useState<AppUser>()

        const handleModalOpen = (mode: 'add' | 'edit', selectedId?: number) => {
            setOpenModal(true)
            setModalMode(mode)

            if (selectedId) {
                userService.getUser(selectedId).then(setSelectedUserToEdit)
            }
        }

        useEffect(() => {
            getAllUsers()
        }, [])

        useEffect(() => {
            setOpenModal(false)
        }, [users])

        const deleteUser = (id: number) => {
            // TODO: Do not delete when the current user is logged in
            userService.deleteUser(id).then(res => {
                getAllUsers()
                alert(res.data)
            }).catch((res) => alert(res.data))
        }

        const getAllUsers = () => {
            userService.getAllUsers().then(setUsers)
        }
        
        const AppModalUser = () => {
            const [role, setRole] = useState<string>('')
            const [firstName, setFirstName] = useState<string>('')
            const [lastName, setLastName] = useState<string>('')
            const [username, setUsername] = useState<string>('')
            const [disabled, setDisabled] = useState<boolean>(false)
            const [password] = useState<string>(Math.random().toString(36).substr(2, 7))

            useEffect(() => {
                if (modalMode === 'edit' && selectedUserToEdit) {
                    setRole(selectedUserToEdit.role)
                    setFirstName(selectedUserToEdit.first_name)
                    setLastName(selectedUserToEdit.last_name)
                    setUsername(selectedUserToEdit.username)
                    setDisabled(selectedUserToEdit.disabled)
                }
            }, [selectedUserToEdit])

            const isAllValuesValid = (): boolean => {
                let valid = true
                const EMPTY_STRING = ''

                if (role.trim() === EMPTY_STRING) valid = false
                if (firstName.trim() === EMPTY_STRING) valid = false
                if (lastName.trim() === EMPTY_STRING) valid = false
                if (username.trim() === EMPTY_STRING) valid = false

                return valid
            }

            return (
                <AppModal
                    open={openModal} 
                    mode={modalMode}
                    title={'Users'} 
                    handleModalClose={() => setOpenModal(false)}
                    isAllValuesValid={isAllValuesValid()}
                    formBody={
                        <div className={'modal-middle-container'}>
                            <FormControl fullWidth={true} variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Role</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={role}
                                    onChange={(event) => setRole(event.target.value as string)}
                                    label="Role"
                                    >
                                    <MenuItem value={'ADMIN'}>Admin</MenuItem>
                                    <MenuItem value={'STAFF'}>Staff</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl 
                                fullWidth={true}
                                className={'form-text-field-control'} 
                                margin={'normal'} 
                                component={'div'}>
                                <TextField
                                    value={firstName}
                                    label={'First Name'}
                                    variant={'outlined'}
                                    onChange={(event) => setFirstName(event.target.value)}
                                />
                            </FormControl>
                            <FormControl 
                                    fullWidth={true}
                                    className={'form-text-field-control'} 
                                    margin={'normal'} 
                                    component={'div'}>
                                <TextField
                                    value={lastName}
                                    label={'Last Name'}
                                    variant={'outlined'}
                                    onChange={(event) => setLastName(event.target.value)}
                                />
                            </FormControl>
                            <FormControl 
                                    fullWidth={true}
                                    className={'form-text-field-control'} 
                                    margin={'normal'} 
                                    component={'div'}>
                                <TextField
                                    value={username}
                                    label={'Username'}
                                    variant={'outlined'}
                                    onChange={(event) => setUsername(event.target.value)}
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
                            {(modalMode !== 'edit') &&
                                <FormControl 
                                        fullWidth={true}
                                        className={'form-text-field-control'} 
                                        margin={'normal'} 
                                        component={'div'}>
                                    <TextField
                                        disabled
                                        value={password}
                                        label={'Temporary Password'}
                                        variant={'outlined'}
                                    />
                                </FormControl>
                            }
                        </div>
                    }
                    handleSubmit={() => {
                        const user: AppUser = {
                            first_name: firstName,
                            last_name: lastName,
                            role: role,
                            username: username,
                            disabled: disabled,
                            password: password
                        }

                        if (modalMode === 'add') {
                            userService.addUser(user).then(() => {
                                alert('User successfully added!')
                                getAllUsers()
                            })
                        } else {
                            if (selectedUserToEdit && selectedUserToEdit.id) {
                                const id = selectedUserToEdit.id

                                userService.updateUser(id, user).then(() => {
                                    alert('User successfully updated!')
                                    getAllUsers()
                                })
                            }
                        }
                    }}
                />
            )
        }

        return (
            <>
                {users &&
                    <SimpleCrudPage<AppUser>
                        title={'Users'}
                        tableRows={users}
                        columnHeaders={
                            [
                                TABLE_HEADERS.FULL_NAME,
                                TABLE_HEADERS.ROLE,
                                TABLE_HEADERS.USERNAME,
                                TABLE_HEADERS.STATUS,
                            ]
                        }
                        renderRow={(user: AppUser) =>
                            <>
                                <TableCell>{Utils.createFullName(user.first_name, user.last_name)}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>
                                    <ActiveChip
                                        color={user.disabled ? 'default' : 'primary'}
                                        label={user.disabled ? 'Disabled' : 'Active'}
                                    />
                                </TableCell>
                            </>
                        }
                        appModal={<AppModalUser/>}
                        deleteAction={deleteUser}
                        handleModalOpen={handleModalOpen}
                    />
                }
            </>
        )
    }

    return (
        <MuiThemeProvider theme={theme}>
            <div className={'admin__content'}>
                <AllUserList/>
            </div>
        </MuiThemeProvider>
    )
}
