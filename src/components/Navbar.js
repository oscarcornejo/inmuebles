import React, { Fragment } from 'react';
import AppBar from '@material-ui/core/AppBar';
import MenuSeccion from './menuNavegacion/MenuSeccion';

const Navbar = (props) => {
    return (
        <Fragment>
            <AppBar position='static'>
                <MenuSeccion />
            </AppBar>
        </Fragment>
    )
}

export default Navbar
