import React, {useState} from "react";
import {
  Container, Paper, Grid, Breadcrumbs, Link, Typography,
  TextField, FormControl, InputLabel, Select, MenuItem, Button,
  Table, TableBody, TableRow, TableCell
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";

import { makeStyles } from '@material-ui/core/styles';

// FIREBASE
import firebase from '../config/configFirebase';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// REDUX
import {connect} from 'react-redux';
import { openMensaje } from '../redux/actions/snackbarAction';
import { crearKeyword } from '../redux/actions/Keyword';

import { withRouter } from 'react-router-dom';


import ImageUploader from 'react-images-upload';
import uuid from 'uuid';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(0),
        minWidth: '100%',
      },
    selectEmpty: {
      marginTop: theme.spacing(0),
    },
  }));

const style = {
  container: {
    paddingTop: "8px"
  },
  paper: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5"
  },
  link: {
    diplay: "flex"
  },
  homeIcon: {
    width: 20,
    height: 20,
    marginRight: "4px"
  },
  submit: {
      marginTop: 15,
      marginBottom: 10
  },
  foto: {
      height: '100px'
  }
};

const CrearPropiedad = (props) => {
    const { history, openMensaje } = props;
    const classes = useStyles();
    const fotoKey = uuid.v4();

    const [nombrePropiedad, setNombrePropiedad] = useState('');
    const [tipoPropiedad, setTipoPropiedad] = useState('');
    const [tipoOperacion, setTipoOperacion] = useState('');
    const [direccion, setDireccion] = useState('');
    const [comuna, setComuna] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [pais, setPais] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [mtsTotal, setMtsTotal] = useState(0);
    const [mtsConstruidos, setMtsConstruidos] = useState(0);
    const [dormitorios, setDormitorios] = useState(0);
    const [banios, setBanios] = useState(0);
    const [precio, setPrecio] = useState(0);
    const [fotos, setFotos] = useState([]);
    const [archivos, setArchivos] = useState([]);
    const [propiedad, setPropiedad] = useState({});


    const subirFotos = (documentos) => {
      // console.log('DOCUMENTOS', documentos);
      Object.keys(documentos).forEach(key => {
          documentos[key].urlTemp = URL.createObjectURL(documentos[key])
      });
      setArchivos(documentos);
    }

  const guardarFotosMultiples = (documentos) => {
    const ref = firebase.storage().ref();
    return Promise.all(documentos.map(file =>{
        return ref.child(file.alias).put(file).then(snapshot =>{
            return ref.child(file.alias).getDownloadURL();
        })
    }))
  }


  const subirImagenes = (e) => {
    
    e.preventDefault();
    const propiedadData = {
      nombrePropiedad, tipoPropiedad, tipoOperacion, 
      direccion, comuna, ciudad, pais, descripcion,
      mtsTotal, mtsConstruidos, dormitorios,
      banios, precio, fotos, keywords: null
      // archivos
    }
    
    //agregar un nombre dinamico por cada imagen que necesites subir al firestorage
    Object.keys(archivos).forEach( function(key) {
      let valorDinamico = Math.floor(new Date().getTime() / 1000);
      let nombre = archivos[key].name;
      let extension = nombre.split(".").pop();
      archivos[key].alias = ( nombre.split(".")[0] + "_" + valorDinamico + "." + extension)
        .replace(/\s/g, "_").toLowerCase();
    });

    const textoBusqueda = propiedadData.direccion + " " + propiedadData.comuna + " " + propiedadData.ciudad + " " + propiedadData.pais;
    const keywords = crearKeyword(textoBusqueda);
   
    guardarFotosMultiples(archivos)
        .then( async (urlImagenes) => {
        const urlFotos = Object.assign({}, urlImagenes);
        const id = uuid.v4();
        propiedadData.fotos = urlFotos;
        propiedadData.keywords = keywords;

            await firebase.firestore().collection("propiedades").doc(id).set(propiedadData, {merge: true})
            .then( (success) =>{
                setPropiedad(propiedadData);
                const mensaje = {
                    open: true, 
                    mensaje: 'La Propiedad se ha publicado con Éxito'
                }
                openMensaje(mensaje);
                history.push("/");
            }).catch( error => {
            const mensaje = {
                open: true, 
                mensaje: error.message
            }
            openMensaje(mensaje);
            });
        })
    }
    const eliminarFoto = (nombreFoto) => {
        setArchivos(archivos.filter(archivo => {
            return archivo.name !== nombreFoto
        }));
    }

  return (

    <Container style={style.container}>
      <Paper style={style.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" style={style.link} href="/">
                <HomeIcon style={style.homeIcon} />
                Home
              </Link>
              <Typography color="textPrimary">Nueva Propiedad</Typography>
            </Breadcrumbs>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField name="Nombre" label="Nombre Propiedad" fullWidth onChange={(e) => setNombrePropiedad(e.target.value)} />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl className={classes.formControl}>
            <InputLabel id="dormitorios-select-label">Tipo Propiedad</InputLabel>
            <Select labelId="dormitorios-select-label" id="dormitorios-select"
            value={tipoPropiedad} onChange={(e) => setTipoPropiedad(e.target.value)} className={classes.selectEmpty}>
                <MenuItem value="">
                    <em>Seleccionar Tipo</em>
                </MenuItem>
                <MenuItem value={'Casa'}>Casa</MenuItem>
                <MenuItem value={'Departamento'}>Departamento</MenuItem>
                <MenuItem value={'ParcelaAgrado'}>Parcela de Agrado</MenuItem>
                <MenuItem value={'Terreno'}>Terreno</MenuItem>
            </Select>
            </FormControl>

          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl className={classes.formControl}>
            <InputLabel id="dormitorios-select-label">Tipo de Operación</InputLabel>
            <Select labelId="dormitorios-select-label" id="dormitorios-select"
            value={tipoOperacion} onChange={(e) => setTipoOperacion(e.target.value)} className={classes.selectEmpty}>
                <MenuItem value="">
                    <em>Seleccionar Operación</em>
                </MenuItem>
                <MenuItem value={'Arriendo'}>Arriendo</MenuItem>
                <MenuItem value={'ArriendoTemporada'}>Arriendo Temporada</MenuItem>
                <MenuItem value={'Venta'}>Venta</MenuItem>
            </Select>
            </FormControl>

          </Grid>

          <Grid item xs={12} md={12}>
            <TextField name="direccion" label="Dirección del Inmueble" fullWidth onChange={(e) => setDireccion(e.target.value)} />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField name="comuna" label="Comuna" fullWidth onChange={(e) => setComuna(e.target.value)}  />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField name="ciudad" label="Ciudad" fullWidth onChange={(e) => setCiudad(e.target.value)}  />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField name="pais" label="País" fullWidth onChange={(e) => setPais(e.target.value)}  />
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField name="descripcion" label="Descripción Propiedad" fullWidth multiline onChange={(e) => setDescripcion(e.target.value)}  />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField name="precio" label="Precio Propiedad" fullWidth value={precio} onChange={(e) => setPrecio(e.target.value)} />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField name="mtsTotal" label="Mts2 Total Propiedad" fullWidth value={mtsTotal} onChange={(e) => setMtsTotal(e.target.value)}  />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField name="mtsConstruidos" label="Mts2 Construidos" fullWidth value={mtsConstruidos} onChange={(e) => setMtsConstruidos(e.target.value)}  />
          </Grid>

          <Grid item xs={12} md={3}>
            {/* <TextField name="mt2" label="Mt2 útiles" fullWidth /> */}
            <FormControl className={classes.formControl}>
            <InputLabel id="dormitorios-select-label">Dormitorios</InputLabel>
            <Select labelId="dormitorios-select-label" id="dormitorios-select"
            value={dormitorios} onChange={(e) => setDormitorios(e.target.value)} className={classes.selectEmpty}>
                <MenuItem value="">
                    <em>Seleccionar Dormitorios</em>
                </MenuItem>
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={'+6'}>Más de 6</MenuItem>
            </Select>
            </FormControl>

          </Grid>

          <Grid item xs={12} md={3}>
            {/* <TextField name="mt2" label="Mt2 útiles" fullWidth /> */}
            <FormControl className={classes.formControl}>
            <InputLabel id="banios-select-label">Baños</InputLabel>
            <Select labelId="banios-select-label" id="banios-select"
            value={banios} onChange={(e) => setBanios(e.target.value)} className={classes.selectEmpty}>
                <MenuItem value="">
                    <em>Seleccionar Baños</em>
                </MenuItem>
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={'+4'}>Más de 4</MenuItem>
            </Select>
            </FormControl>

          </Grid>

          

        <Grid item xs={12} md={6}>
            <ImageUploader key={fotoKey} withIcon={true}  buttonText='Seleccionar Imágenes' 
            onChange={subirFotos} imgExtension={['.jpg', '.png', '.jpeg']} maxFileSize={5242880} />
        </Grid>

        <Grid item xs={12} md={6}>
            <Table>
                <TableBody>
                    {
                        archivos.map( (archivo, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell align='left'>
                                        <img src={archivo.urlTemp} style={style.foto} alt='Fotos' />
                                    </TableCell>

                                    <TableCell align='left'>
                                        <Button onClick={() => eliminarFoto(archivo.name) } variant='contained' color='secondary' size='small'>Eliminar</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </Grid>



        </Grid>

        <Grid container justify="center">
            <Grid item xs={12} md={6}>
                <Button onClick={subirImagenes} type='button' fullWidth variant='contained' size='large' color='primary' style={style.submit}>
                    Publicar Propiedad
                </Button>
            </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default withRouter(connect(null, {openMensaje})(CrearPropiedad));
// export default NuevaPropiedad;
