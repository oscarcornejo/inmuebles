import firebase from "../../config/configFirebase";
import 'firebase/firestore';
import 'firebase/auth';
import { openMensaje } from "./snackbarAction";

export const iniciarSesion = (email, password, history) => {
  
  return async (dispatch, ownProps) => {

    return new Promise((resolve, eject) => {
      
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then( (auth) => {
      // console.log('AUTH:: ', auth);
      firebase.firestore().collection('usuarios').doc(auth.user.uid).get()
      .then( doc => {
        const usuarioDB = doc.data();
        console.log('usuarioDB:: ', usuarioDB);
        dispatch({ type: 'LOGIN', sesion: usuarioDB, usuarioLogeado: true });

        const mensaje = {
          open: true, 
          mensaje: 'Ha Iniciado Sesión con Éxito'
        }
        dispatch(openMensaje(mensaje));
        resolve({status: true});
        // history.push('/');
        // window.location.href='/';

      }).catch( error => {
        console.log('ERROR: ', error);
        resolve({status: false, mensaje: error});
      })
    }).catch( error => {
      console.log('ERROR: ', error);
      switch (error.message) {
        case 'There is no user record corresponding to this identifier. The user may have been deleted.':
          dispatch({ type: 'OPEN_SNACKBAR', open: true, mensaje: 'No existe un usuario asociado a este email, favor ingrese un correo válido.'});
        break;
        case 'The password is invalid or the user does not have a password.':
          dispatch({ type: 'OPEN_SNACKBAR', open: true, mensaje: 'La contraseña no es válida o el usuario no tiene una contraseña.' });
        break;
        case 'Too many unsuccessful login attempts. Please try again later.':
          dispatch({ type: 'OPEN_SNACKBAR', open: true, mensaje: 'Demasiados intentos de inicio de sesión fallidos. Por favor, inténtelo de nuevo más tarde.' });
        break;
        default:
          dispatch({ type: 'OPEN_SNACKBAR', open: true, mensaje: 'Su Ingreso no pudo ser realizado, favor inténtelo más tarde.'});
        break;
      }
    });

  });

  }
}

export const crearUsuario = (usuario) => {
  // console.log('crearUsuario:: ', usuario);
  
  return async (dispatch) => {
    return new Promise((resolve, eject) => {
      firebase.auth().createUserWithEmailAndPassword(usuario.email, usuario.password)
      .then( (auth) => {
      firebase.firestore().collection('usuarios')
      .doc(auth.user.uid)
      .set({
        usuarioId: auth.user.uid,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido
      }, {merge: true})
      .then( doc => {
        usuario.usuarioId = auth.user.uid;
        dispatch({
          type: 'LOGIN',
          sesion: usuario,
          usuarioLogeado: true
        });
        resolve({status: true});
        // window.location.href='/ingresar-usuario';
      })
      .catch( error => {
        console.log('ERROR: ', error);
        // dispatch({ type: 'OPEN_SNACKBAR', open: true, mensaje: error.message});
        resolve({status: false, mensaje: error});
      })
    }).catch( error => {
      console.log('ERROR: ', error);
      switch (error.message) {
        case 'Password should be at least 6 characters':
            dispatch({ type: 'OPEN_SNACKBAR', open: true, mensaje: 'Debe ingresar una contraseña de almenos 6 caracteres.'});
            break;
        case 'The email address is already in use by another account.':
                dispatch({ type: 'OPEN_SNACKBAR', open: true, mensaje: 'Este email ya está siendo utilizado por otro Usuario.'});
                break;
        case 'The email address is badly formatted.':
                dispatch({ type: 'OPEN_SNACKBAR', open: true, mensaje: 'El formato de su email No es Válido.'});
                break;
        default:
            dispatch({ type: 'OPEN_SNACKBAR', open: true, mensaje: 'Su Registro no pudo ser realizado, favor inténtelo más tarde.'});
            break;
      }
    });

    });
  }
}

  export const salirSesion = (value) => {

    // console.log('VALUE:: ', value);

    return async (dispatch) => {
      await firebase.auth().signOut().then( () => {
        dispatch({
          type: 'LOGOUT',
          nuevoUsuario: {
            nombre: '',
            apellido: '',
            email:  '',
            foto: '',
            telefono: '',
            id: ''
        },
        usuarioLogeado: value
        })
      })
    }
  } 