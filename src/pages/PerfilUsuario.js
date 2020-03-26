import React, { useState, useEffect, Fragment } from "react";

// REDUX
import { useSelector, useDispatch } from "react-redux";
import {connect} from 'react-redux';
import { openMensaje } from '../redux/actions/snackbarAction';

// MATERIAL UI
import { Container, Avatar, Typography, Grid, TextField, Button } from "@material-ui/core";

import fotoDefault from "./../logo.svg";

// FIREBASE
import firebase from "./../config/configFirebase";
import "firebase/firestore";
import "firebase/auth";
import 'firebase/storage';

// react-images-upload
// import ImageUploader from 'react-images-upload';
import {DropzoneDialog} from 'material-ui-dropzone'
import uuid from 'uuid';

const style = {
  paper: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%",
    marginTop: 20
  },
  submit: {
    marginTop: 15,
    marginBottom: 50
  },
  avatar: {
    margin: 10,
    width: 100,
    height: 100
  }
};

const PerfilUsuario = ({openMensaje}) => {
  
    const usuarioLogeado = useSelector( state => state.authReducer.usuarioLogeado );
    const usuario = useSelector( state => state.authReducer.usuario );

  const [estado, setEstado] = useState({
    nombre: "", apellido: "", email: "", foto: "", telefono: "", usuarioId: ""
  });

  const [imagenPerfil, setImagenPerfil] = useState(estado.foto )
  const [open, setOpen] = useState(false);
//   const [newImage, setNewImage] = useState({});
  
  
  
  useEffect(() => {
      console.log(usuario);
    if(estado.usuarioId === '') {
        if(usuarioLogeado) {
            setEstado(usuario);
            setImagenPerfil(usuario.foto);
        }
    }
  }, [estado, usuarioLogeado, usuario]);

  useEffect(() => {
    console.log('usuario:: ', usuario);
  }, [usuario]);

  const cambiarDatos = (e) => {
      const {name, value} = e.target;
      setEstado(prev => ({
          ...prev,
          [name]: value
      }))
  }

  const dispatch = useDispatch();
//   const openSnackbar = useSelector(state => state.openSnackbarReducer.open);
//   const openSnackbarMessage = useSelector(state => state.openSnackbarReducer.mensaje);

  const actualizarPerfil = (e) =>{
      e.preventDefault();
      // console.log('DATOS:: ', estado);
    firebase.firestore().collection('usuarios').doc(firebase.auth().currentUser.uid)
    .set(estado, {merge: true}).then( async (resp) => {
        debugger
        dispatch({type: 'LOGIN', sesion: estado, usuarioLogeado: true});
        const mensaje = { open: true, mensaje: 'Los Datos se Han Actualizado con Éxito'}
        await openMensaje(mensaje);
    }).catch( error => {
        const mensaje = {  open: true, mensaje: `ERROR: ${error.message}`}
        dispatch(openMensaje(mensaje));
    });

    // if(Object.keys(newImage).length > 0 ){
    //     firebase.storage().ref().child(newImage.alias).put(newImage.foto)
    //     .then( async (data) => {
    //         // console.log('data:: ', data);
    //         await firebase.storage().ref().child(newImage.alias).getDownloadURL()
    //         .then( async (urlFoto) => {
    //             // console.log('urlFoto:: ', urlFoto);
    //             estado.foto = urlFoto;
    //             setImagenPerfil(urlFoto);
    //             await firebase.firestore().collection('usuarios')
    //             .doc(firebase.auth().currentUser.uid).set({ foto: urlFoto}, {merge: true})
    //             .then( userDB => {
    //                 dispatch({type: 'LOGIN', sesion: estado, usuarioLogeado: true })
    //             })
    //         });
    //     });
    //     setNewImage({});
    // }
  }

  const subirFoto = (fotos) => {
    // 1.- Capturar Imagen
    const foto = fotos[0];
    // 2.- Renombrar la imagen
    const idFoto = uuid.v4();
    // 3.- Obtener el nombre de la Foto
    const nombreFoto = foto.name;
    // 4.- Obtener la extension de la imagen
    const extensionFoto = nombreFoto.split('.').pop();
    // 5.- Crear el nuevo nombre de la foto - alias
    const alias = (nombreFoto.split('.')[0] + '_' + idFoto + '.' + extensionFoto).replace(/\s/g,"_").toLowerCase();

    // setNewImage({ alias, foto});
    firebase.storage().ref().child(alias).put(foto)
        .then( async (data) => {
            // console.log('data:: ', data);
            await firebase.storage().ref().child(alias).getDownloadURL()
            .then( async (urlFoto) => {
                // console.log('urlFoto:: ', urlFoto);
                estado.foto = urlFoto;
                setImagenPerfil(urlFoto);
                await firebase.firestore().collection('usuarios')
                .doc(firebase.auth().currentUser.uid).set({ foto: urlFoto}, {merge: true})
                .then( userDB => {
                    dispatch({type: 'LOGIN', sesion: estado, usuarioLogeado: true })
                })
            });
        });
    setOpen(false);
  }

    const handleClose = () =>{
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }

  return (
    <Fragment>
      
        <Container component="main" maxWidth="md" justify="center">
         { usuarioLogeado ?
          <div style={style.paper}>
            
            <Avatar style={style.avatar} src={imagenPerfil || fotoDefault} />

                <div>
                    <Button onClick={handleOpen}>Cambiar Imagen</Button>
                        <DropzoneDialog
                            open={open}
                            onSave={subirFoto}
                            acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                            maxFileSize={5000000}
                            onClose={handleClose}
                            dialogTitle={'Subir Imágenes'}
                            dropzoneText={'Arrastra tu imagen a esta zona o haz click aquí'}
                            cancelButtonText={'Cancelar'}
                            submitButtonText={'Subir Imagen'}
                            filesLimit={1}
                            showPreviews={false}
                            showPreviewsInDropzone={true}
                            showAlerts={false}
                        />
                </div>
            
            <Typography>Perfil de Cuenta</Typography>
            
            <form style={style.form} onSubmit={actualizarPerfil}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField name="nombre" variant="outlined" fullWidth 
                    label="Nombre" value={estado.nombre} onChange={cambiarDatos} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField name="apellido" variant="outlined" fullWidth
                    label="Apellido" value={estado.apellido} onChange={cambiarDatos} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField name="email" variant="outlined" fullWidth
                    label="Email" value={estado.email} onChange={cambiarDatos} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField name="telefono" variant="outlined" fullWidth
                    label="Teléfono" value={estado.telefono} onChange={cambiarDatos} />
                </Grid>

              </Grid>

              <Grid container justify="center">
                <Grid item xs={12} md={6}>
                  <Button type="submit" fullWidth variant="contained" size='large' color="primary" style={style.submit} >
                      Guardar Cambios
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
          : <h2>Debe Iniciar Sesion</h2>
        }

        </Container>
     
    </Fragment>
  );
};

export default connect(null, {openMensaje})(PerfilUsuario);
