import { Container, FormControl, TextField } from '@material-ui/core'
import { useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'
import { authenticationService } from '../../services/AuthenticationService'
import { AppButton } from '../../styled-mui-custom'
import { LABELS, URIS } from '../global'
import './LoginPage.scss'

type LoginPageProps = {
} & RouteComponentProps

export const LoginPage = withRouter(({history}: LoginPageProps) => {

    const [username, setUsername] = useState<string>()
    const [password, setPassword] = useState<string>()

    const login = (event: any) => {
        event.preventDefault()

        if (username && password) {
            authenticationService.login(username, password)
            .then(() => {
                history.push(URIS.HOME)
                window.location.reload()
            }).catch(() => {
                alert('Incorrect username or password')
            })
        } else {
            console.log('error')
        }
    }

    return (
        <div className={'login-container'}>
            <Container className={'form-container'} maxWidth={'xs'}>
                <form onSubmit={login}>
                    <FormControl className={'form-text-field-control'} margin={'normal'} component={'div'}>
                        <TextField
                            label={LABELS.USERNAME}
                            variant={'outlined'}
                            onChange={event => setUsername(event.target.value)}
                        />
                    </FormControl>
                    <FormControl className={'form-text-field-control'} margin={'normal'} component={'div'}>
                        <TextField
                            label={LABELS.PASSWORD}
                            variant={'outlined'}
                            type={'password'}
                            onChange={event => setPassword(event.target.value)}
                        />
                    </FormControl>
                    <AppButton
                        type={'submit'}
                        className={'form-button'}
                        variant={'contained'}
                        color={'primary'}
                        onClick={login}>
                        {LABELS.LOGIN}
                    </AppButton>
                </form>
            </Container>
        </div>
    )
})