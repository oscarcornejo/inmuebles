import React from 'react';
import { useSelector } from "react-redux";
import {Route, Redirect} from 'react-router-dom';
// import { useAuthentication } from "./auth";


const RutaAtenticada = ({component: Component, auth, ...rest}) => {
    
    // console.log('RutaAtenticada:: ');
    // console.log('component:: ', Component);
    // console.log('auth:: ', auth);

    const usuarioLogeado = useSelector(state => state.authReducer.usuarioLogeado);
    console.log('usuarioLogeado:: ', usuarioLogeado);

    return ( 
        <Route {...rest} render={ (props) => (usuarioLogeado === true) 
            ? <Component {...props} {...rest} />
            : <Redirect to='/ingresar-usuario' />
        } />
     );
}
 
export default RutaAtenticada;