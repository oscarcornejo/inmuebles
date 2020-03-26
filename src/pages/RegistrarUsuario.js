import React, { Fragment, useState } from 'react'
import { Container, Avatar, Typography, Grid, TextField, Button, Card, CardContent, CardActions } from '@material-ui/core';

import LockIcon from '@material-ui/icons/Lock';

// SET FIREBASE
import 'firebase/auth';
import 'firebase/firestore';

// REDUX
import {connect} from 'react-redux';
import {crearUsuario} from '../redux/actions/authAction';
import { openMensaje } from '../redux/actions/snackbarAction';

const RegistrarUsuario = ({history, crearUsuario, openMensaje}) => {

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const style ={
        paper: {
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        card: {
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        avatar: {
            margin: 8,
            backgroundColor: '#e53935'
        },
        form: {
            width: '100%',
            margintop: 10
        },
        submit: {
            marginTop: 15,
            marginBottom: 20
        }
    }

    const registrarUsuario = async (e) => {
        e.preventDefault();
        if (nombre === '' || apellido === '' || email === '' || password === '') {
            return false;
        }

        const usuario = {
            // usuarioId: resp.user.uid,
            nombre: nombre,
            apellido: apellido,
            email: email,
            password: password
        }

        let callback = await crearUsuario(usuario);
        // const mensaje = {
        //     open: true, 
        //     mensaje: 'Su Registro se ha realizado con Éxito'
        // };
        // openMensaje(mensaje);

        if (callback.status) {
            history.push('/ingresar-usuario');
            const mensaje = {
                open: true, 
                mensaje: 'Su Registro se ha realizado con Éxito'
            }
            await openMensaje(mensaje);
        } else {
            const mensaje = {open: true, mensaje: callback.mensaje.message  }
            await openMensaje(mensaje);
        }

        // setNombre('');
        // setApellido('');
        // setEmail('');
        // setPassword('');
        // history.push('/ingresar-usuario');
    }

    return (
        <Fragment>
             <Container maxWidth='md' >
                <Grid container spacing={3} justify="center" alignItems="center" style={{height: '90vh'}}>
                    <Grid item xs={12} sm={12} md={10} lg={10}>
                        <Card>
                        <form noValidate autoComplete="off">
                            <CardContent style={{padding: '20px'}}>
                                <div style={style.card}>
                                    <Avatar style={style.avatar}>
                                        <LockIcon />
                                    </Avatar>

                                    <Typography component='h1' variant='h5'>
                                        Registro de Usuario
                                    </Typography>
                                </div>
                                
                                <Grid container spacing={3}>
                                    <Grid item md={6} xs={12}>
                                        <TextField required id="nombre-required" label="Required" value={nombre} onChange={(e) => setNombre(e.target.value)} name='nombre' fullWidth label='Ej: Oscar' />
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <TextField required id="apellido-required" label="Required" value={apellido} onChange={(e) => setApellido(e.target.value)} name='apellido' fullWidth label='Ej: Cornejo' />
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <TextField required id="email-required" label="Required" value={email} onChange={(e) => setEmail(e.target.value)} name='email' fullWidth label='Ej: oscar@cornejo.cl' />
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <TextField required id="password-required" label="Required" type="password" value={password} onChange={(e) => setPassword(e.target.value)} name='password' fullWidth label='Ej: unP4ssW0rd1nic0' />
                                    </Grid>
                                </Grid>
                            </CardContent>

                        <CardActions style={{padding: '20px'}}>
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12}>
                                    <Button fullWidth variant="contained" onClick={registrarUsuario} size="medium" color='primary'>Quiero Registrarme</Button>
                                </Grid>
                            </Grid>
                        </CardActions>
                        </form>
                    </Card>
                </Grid>
             </Grid>
             </Container>
             
            {/* <Container maxWidth='md'>
                <div style={style.paper}>
                    <Avatar style={style.avatar}>
                        <LockIcon />
                    </Avatar>
                    
                    <Typography component='h1' variant='h5'>
                        Registro de Usuario
                    </Typography>

                    <form style={style.form} onSubmit={registrarUsuario}>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <TextField value={nombre} onChange={(e) => setNombre(e.target.value)} name='nombre' fullWidth label='Ej: Oscar' />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField value={apellido} onChange={(e) => setApellido(e.target.value)} name='apellido' fullWidth label='Ej: Cornejo' />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField value={email} onChange={(e) => setEmail(e.target.value)} name='email' fullWidth label='Ej: oscar@cornejo.cl' />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField value={password} onChange={(e) => setPassword(e.target.value)} name='password' fullWidth label='Ej: unP4ssW0rd1' />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12}>
                                <Button type='submit' variant="contained" fullWidth size="large" color='primary' style={style.submit}>
                                    Quiero Registrarme
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                
                </div>
            </Container> */}
        </Fragment>
    )
}

export default connect(null, {crearUsuario, openMensaje})(RegistrarUsuario);
