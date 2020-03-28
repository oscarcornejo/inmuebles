import React, { Fragment, useEffect } from 'react';

// COMPONENTS
import Navbar from './components/Navbar';

// PAGES
import RegistrarUsuario from './pages/RegistrarUsuario';
import ListaPropiedades from './pages/ListaPropiedades';
import IngresoUsuario from './pages/IngresoUsuario';

// REACT ROUTER 
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

// MATERIAL UI
import theme from "./theme/theme";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { Grid, Snackbar } from '@material-ui/core';

// CSS
import './App.css';


// SET FIREBASE
import 'firebase/firestore';
import 'firebase/auth';

// REDUX
import { useSelector, useDispatch } from "react-redux";
import RutaAtenticada from './auth/RutaAutenticada';

import { useAuthentication } from "./auth/auth";
import PerfilUsuario from './pages/PerfilUsuario';
import CrearPropiedad from './pages/CrearPropiedad';
import EditarPropiedad from './pages/EditarPropiedad';
import Propiedad from './pages/Propiedad';


function App() {
    const auth = useAuthentication();

  const usuarioLogeado = useSelector(state => state.authReducer.usuarioLogeado);
  const dispatch = useDispatch();
  const openSnackbar = useSelector(state => state.openSnackbarReducer.open);
  const openSnackbarMessage = useSelector(state => state.openSnackbarReducer.mensaje);

  // console.log('usuarioLogeado:: ', usuarioLogeado)

  useEffect(() => {
    
  }, [openSnackbar, openSnackbarMessage])
  
  return (
    <Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSnackbar ? openSnackbar : false}
        autoHideDuration={2500}
        ContentProps={{ "aria-describedby": "message-id" }}
        message={ <span id="message-id">{openSnackbar ? openSnackbarMessage : ""}</span> }
        onClose={ () => {
          dispatch({ type: "OPEN_SNACKBAR", openMensaje: { open: false, mensaje: ""}});
        }}
      />
    

    <Router>
      <MuiThemeProvider theme={theme}>
        <Navbar />
        <Grid container>
          <Switch>
          CrearPropiedad.js
            {/* <Route exact path='/crear-propiedad' component={CrearPropiedad} /> */}
            {/* <Route exact path='/perfil-usuario' component={PerfilUsuario} /> */}
            <Route path="/crear-propiedad" exact
                  render={ () => usuarioLogeado ? 
                  <CrearPropiedad /> : <Redirect to='/ingresar-usuario' /> }  
            />
            <Route exact path="/perfil-usuario" 
                  render={ () => usuarioLogeado ? <PerfilUsuario /> : <Redirect to='/ingresar-usuario' /> } 
            />
            <Route exact path="/editar-propiedad/:id" 
                render={ (props) => usuarioLogeado ? 
                <EditarPropiedad {...props} /> : <Redirect to='/ingresar-usuario' /> }  
            />

            <Route exact path="/propiedad/:id" component={Propiedad} /> 

            <Route exact path="/ingresar-usuario" component={IngresoUsuario} />
            <Route exact path="/registrar-usuario" component={RegistrarUsuario} />
            <Route exact path="/" component={ListaPropiedades} />
          </Switch>
        </Grid>
      </MuiThemeProvider>
    </Router>

    </Fragment>
  );
}

export default App;
