import React, {useState} from 'react';
import { Container, Avatar, Typography, TextField, Button } from '@material-ui/core';
import LockOutlineIcon from '@material-ui/icons/LockOpenOutlined';

// SET FIREBASE
import 'firebase/auth';

// ACTION
import {iniciarSesion} from '../redux/actions/authAction';
import { openMensaje } from '../redux/actions/snackbarAction';

// REDUX
import {connect} from 'react-redux';

const style = {
    paper: {
    marginTop: 9,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
    },
    avatar: {
        margin: 5,
        backgroundColor: 'red'
    },
    form: {
        width: '100%',
        marginTop: 10
    }
}

const IngresoUsuario = ({history, iniciarSesion, openMensaje}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const ingresar = async (e) => {
        e.preventDefault();

        if (email === '' && password === '') {
            return false;
        }

        if (email === '' ) {
            return false;
        }

        if (password === '') {
            return false;
        }

        let callback = await iniciarSesion(email, password, history);
        
        if (callback.status) {
            history.push('/');
            const mensaje = {
                open: true, 
                mensaje: 'Ha Iniciado Sesión con Éxito'
            }
            await openMensaje(mensaje);
        } else {
            const mensaje = {
                open: true, 
                mensaje: callback.mensaje.message
            }
            await openMensaje(mensaje);
        }
        
    }

    return (
        <Container maxWidth='xs'>
            <div style={style.paper}>
                <Avatar style={style.avatar}>
                    <LockOutlineIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Ingresar
                </Typography>
                <form style={style.form} onSubmit={ingresar}>
                    <TextField variant="outlined" label="Email" name="email" fullWidth margin="normal" onChange={ (e) => setEmail(e.target.value)} />
                    <TextField type="password" variant="outlined" label="Password" name="password" fullWidth margin="normal" onChange={ (e) => setPassword(e.target.value)} />
                    <Button type="submit" variant="contained" color="primary" fullWidth>Ingresar</Button>
                </form>
            </div>
        </Container>
    )
}

const mapStateToProps = (state) =>{
    // console.log('mapStateToProps:: ', state);
    return {
        iniciarSesion: state.usuarioReducer
    }
}

export default connect(mapStateToProps, {iniciarSesion, openMensaje})(IngresoUsuario);
