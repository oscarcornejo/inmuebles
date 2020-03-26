import React from 'react';
import { List, ListItem, ListItemText, Avatar } from '@material-ui/core';
import { Link } from "react-router-dom";

const MenuDerecha = ({classes, usuario, textoUsuario, fotoUsuario, salirSesion}) => {

    return ( 
        <div className={classes.list}>
            <List>
                <ListItem button component={Link} to='/registrar-usuario'>
                    <Avatar src={fotoUsuario} />
                    <ListItemText classes={{primary: classes.listItemText}} primary={textoUsuario}/>
                </ListItem>

                <ListItem button onClick={() => salirSesion(false)}>
                    <ListItemText classes={{primary: classes.listItemText}} primary='Salir'></ListItemText>
                </ListItem>
            </List>
        </div>
     );
}
 
export default MenuDerecha;