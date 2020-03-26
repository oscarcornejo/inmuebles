import React from 'react'
import { List, ListItem, ListItemText, Divider } from '@material-ui/core';
import { Link } from "react-router-dom";

const MenuIzquierda = ({classes}) => {
    return ( 
        <div className={classes.list}>
            <List>
                <ListItem component={Link} button to="/perfil-de-usuario">
                    <i className="material-icons">account_box</i>
                    <ListItemText classes={{primary: classes.ListItemText}} primary="Perfil" />
                </ListItem>
            </List>
            
            <Divider />

            <List>
                <ListItem component={Link} button to="/crear-propiedad">
                    <i className="material-icons">add_box</i>
                    <ListItemText classes={{primary: classes.ListItemText}} primary="Crear Propiedad" />
                </ListItem>

                <ListItem component={Link} button to="">
                <i className="material-icons">business</i>
                    <ListItemText classes={{primary: classes.ListItemText}} primary="Propiedades" />
                </ListItem>

                <ListItem component={Link} button to="">
                <i className="material-icons">email</i>
                    <ListItemText classes={{primary: classes.ListItemText}} primary="Mensajes" />
                </ListItem>
            </List>
        </div>
     );
}
 
export default MenuIzquierda;