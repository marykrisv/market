import {Button, Chip, withStyles} from '@material-ui/core'

export const AppButton = withStyles(() => ({
    label: {
        color: 'white',
    },
}))(Button)

export const ActiveChip = withStyles(() => ({
    root: {
        fontSize: '16px',
        height: 'inherit',
    },
    colorPrimary: {
        backgroundColor: '#f8c291',
        color: '#eb2f06',
    },
}))(Chip)