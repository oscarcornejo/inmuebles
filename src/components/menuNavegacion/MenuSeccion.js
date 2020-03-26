import React, { Fragment, useState, useEffect } from 'react'

// MATERIAL UI
import { Toolbar, Typography, Button, IconButton, Drawer, Avatar, Menu, MenuItem} from '@material-ui/core'
import { withStyles } from "@material-ui/core/styles";

// SET FIREBASE
import "firebase/firestore";
import "firebase/auth";

// REACT ROUTER DOM
import { withRouter, Link } from "react-router-dom";

// REDUX
import { connect, useSelector } from "react-redux";
import { salirSesion } from "../../redux/actions/authAction";

// SECCIONES
import MenuDerecha from "./MenuDerecha";
import MenuIzquierda from "./MenuIzquierda";

import fotousuario from "./../../logo.svg";

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex"
      }
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none"
      }
    },
    grow: {
      flexGrow: 1
    },
    avatarSize: {
      width: "40px",
      height: "40px"
    },
    listItemText: {
      fontSize: "14px",
      fontWeight: 600,
      paddingLeft: "15px",
      color: "#212121"
    },
    list: {
      width: 250
    }
  });

const MenuSeccion = ({ salirSesion, classes, history }) => {

    const usuario = useSelector(state => state.authReducer.usuario);
    const usuarioLogeado = useSelector(state => state.authReducer.usuarioLogeado);

    const textoUsuario = `${usuario.nombre} ${usuario.apellido}`;
    const [openMenuDer, setOpenMenuDer] = useState({ right: false });
    const [openMenuIzq, setOpenMenuIzq] = useState({ left: false });

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };

    const verPerfil = () => {
      setAnchorEl(null);
      history.push("/perfil-usuario");
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    useEffect(() => {
        // salirSesion(dispatch);
      }, [usuario]);

    const toggleDrawer = (side, open) => {
        // console.log(side, open);
        if (side === "left") {
          setOpenMenuIzq({ ...openMenuIzq, [side]: open });
        } else {
          setOpenMenuDer({ ...openMenuDer, [side]: open });
        }
      };

      const cerrarSesion = async (value) => {
        await salirSesion(value).then( (resp) => {
            // console.log('RESP:: ', resp);
        });
        setAnchorEl(null);
        history.push("/ingresar-usuario");
      };

      let wrapper = React.createRef();


    return (
        <Fragment>
          <Drawer ref={wrapper} open={openMenuIzq.left} onClose={() => toggleDrawer("left", false)} anchor="left">
            <div role="button" onClick={() => toggleDrawer("left", false)} onKeyDown={() => toggleDrawer("left", false)}>
              <MenuIzquierda classes={classes} />
            </div>
          </Drawer>

          <Drawer open={openMenuDer.right} onClose={() => toggleDrawer("right", false)} anchor="right">
            <div role="button" onClick={() => toggleDrawer("right", false)} onKeyDown={() => toggleDrawer("right", false)}>
              <MenuDerecha classes={classes} usuario={usuario} textoUsuario={textoUsuario}
                fotoUsuario={usuario.foto || fotousuario} salirSesion={cerrarSesion} />
            </div>
          </Drawer>

          <Toolbar>
            
            <IconButton color="inherit" onClick={() => toggleDrawer("left", true)}>
              <i className="material-icons">menu</i>
            </IconButton>

            <Typography variant="h6">Propiedades.cl</Typography>
            <div className={classes.grow}></div>
            <div className={classes.sectionDesktop} style={{ marginTop: '5px'}}>
                
                <IconButton color="inherit" component={Link} to=''>
                    <i className='material-icons'>mail</i>
                </IconButton>
                
                {/* { usuarioLogeado === true && <Button color="inherit" onClick={ () => cerrarSesion(false) }>Cerrar Sesión</Button>} */}
                { usuarioLogeado === false &&  <Button color="inherit" component={Link} to='/ingresar-usuario'>Login</Button> }
                { usuarioLogeado === false &&  <Button color="inherit" component={Link} to='/registrar-usuario'>Registrar</Button> }
                {/* { usuarioLogeado && <Button color="inherit">{textoUsuario}</Button> } */}
                {/* <Avatar src={usuario.foto || fotousuario}></Avatar> */}
                { usuarioLogeado &&
                  <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    <span style={{ marginRight: '10px', color: 'white' }}>{textoUsuario}</span>
                    <AccountCircleIcon style={{ color: 'white' }} />
                    <ExpandMoreIcon style={{ color: 'white' }}  />
                  </Button>
                }
                <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={verPerfil}>
                    {/* <img src={usuario.foto || fotousuario} alt='perfil' />  */}
                    Mi Perfil
                  </MenuItem>
                  <MenuItem onClick={ () => cerrarSesion(false) }>Cerrar Sesión</MenuItem>
                </Menu>

            </div>
            
            <div className={classes.sectionMobile}>
              <IconButton color="inherit" onClick={() => toggleDrawer("right", true)}>
                <i className="material-icons">more_vert</i>
              </IconButton>
            </div>
          </Toolbar>
    </Fragment>
    )
}

const mapStateToProps = (state) =>{
    return {
        iniciarSesion: state.usuarioReducer
    }
}

export default connect(mapStateToProps, { salirSesion })(
    withRouter(withStyles(styles)(MenuSeccion))
  );
