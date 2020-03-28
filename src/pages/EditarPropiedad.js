import React, { useState, useEffect } from "react";

// MATERIAL UI
import { Paper, Container, Grid, Breadcrumbs, Link, Typography, FormControl, InputLabel, Select,
  MenuItem, TextField, Button, Table, TableRow, TableCell, TableBody } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { makeStyles } from "@material-ui/core/styles";

// LIBRERIAS
import ImageUploader from "react-images-upload";
import uuid from "uuid";

// REDUX
import { crearKeyword } from "../redux/actions/Keyword";
import {connect} from 'react-redux';
import { openMensaje } from '../redux/actions/snackbarAction';

// FIREBASE
import firebase from "../config/configFirebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

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
    padding: "20px",
    backgroundColor: "#f5f5f5"
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
  fotoInmueble: {
    height: "100px"
  }
};

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: "100%"
  },
  selectEmpty: {
    marginTop: theme.spacing(0)
  }
}));

const EditarPropiedad = props => {
  
  const classes = useStyles();
  const uniqueID = uuid.v4();
  const fotoKey = uuid.v4();

  const { history, openMensaje } = props;
  const { id } = props.match.params;
  const [propiedad, setPropiedad] = useState({});

  useEffect(() => {
    const getData = async () => {
      firebase.firestore().collection("propiedades").doc(id).get()
        .then( resp =>  {
          console.log('propiedades:: ', resp.data());
          setPropiedad(resp.data());
        }).catch( error => {
          console.log(error.message);
      });
    }
    getData();
  }, [id]);

  const handleChange = (e) => {
    setPropiedad({...propiedad, [e.target.name]: e.target.value})
  }

  const subirImagenes = async (imagenes) => {
    //agregar un nombre dinamico por cada imagen que necesites subir al firestorage
    Object.keys(imagenes).forEach(key => {
      let codigoDinamico = uuid.v4();
      let nombreImagen = imagenes[key].name;
      let extension = nombreImagen.split(".").pop();
      imagenes[key].alias = (nombreImagen.split(".")[0] + "_" + codigoDinamico + "." + extension).replace(/\s/g, "_").toLowerCase();
    });

    await guardarFotosMultiples(imagenes)
    .then( async (urlImagenes) => {
      propiedad.fotos = propiedad.fotos.concat(urlImagenes);
      
      await firebase.firestore().collection("propiedades").doc(id).set(propiedad, {merge: true})
        .then( (success) =>{
          setPropiedad(propiedad);
          const mensaje = { open: true,  mensaje: 'La Propiedad se ha publicado con Éxito' }
          openMensaje(mensaje);
          history.push("/");
        }).catch( error => {
          console.log(error.message);
          const mensaje = { open: true, mensaje: error.message }
          openMensaje(mensaje);
        });
    }).catch( error => {
      console.log(error.message);
    });
  }

  const guardarFotosMultiples = (documentos) => {
    const ref = firebase.storage().ref();
    return Promise.all(documentos.map(file =>{
        return ref.child(file.alias).put(file).then(snapshot =>{
            return ref.child(file.alias).getDownloadURL();
        })
    }))
  }

  const eliminarFoto = fotoUrl => () => {
    // const {id} = props.match.params;
    console.log('LLegué!');

    let fotoID = fotoUrl.match(/[\w-]+.(jpg|png|jepg|gif|svg)/);
    fotoID = fotoID[0];

    firebase.storage().ref().child(fotoID).delete();
  };

  const guardarPropiedad = () => {
    const { id } = props.match.params;

    // const propiedadData = {
    //   nombrePropiedad, tipoPropiedad, tipoOperacion,
    //   direccion, comuna, ciudad, pais, descripcion, mtsTotal, 
    //   mtsConstruidos, dormitorios, banios, precio, fotos, keywords: null
    //   // archivos
    // };

    // Object.keys(archivos).forEach( function(key) {
    //   let valorDinamico = Math.floor(new Date().getTime() / 1000);
    //   let nombre = archivos[key].name;
    //   let extension = nombre.split(".").pop();
    //   archivos[key].alias = ( nombre.split(".")[0] + "_" + valorDinamico + "." + extension)
    //     .replace(/\s/g, "_").toLowerCase();
    // });

    // const textoBusqueda = propiedadData.direccion + " " + propiedadData.comuna + " " + propiedadData.ciudad + " " + propiedadData.pais;
    // const keywords = crearKeyword(textoBusqueda);

    // propiedadData.keywords = keyWords;
    
    // guardarFotosMultiples(archivos)
    //   .then( async (urlImagenes) => {
    //     const urlFotos = Object.assign({}, urlImagenes);
    //     const id = uuid.v4();
    //     propiedadData.fotos = urlFotos;
    //     propiedadData.keywords = keywords;

    //         await firebase.firestore().collection("propiedades").doc(id).set(propiedadData, {merge: true})
    //         .then( (success) =>{
    //             setPropiedad(propiedadData);
    //             const mensaje = {
    //                 open: true, 
    //                 mensaje: 'La Propiedad se ha publicado con Éxito'
    //             }
    //             openMensaje(mensaje);
    //             history.push("/");
    //         }).catch( error => {
    //         const mensaje = {
    //             open: true, 
    //             mensaje: error.message
    //         }
    //         openMensaje(mensaje);
    //         });
    //   })

    // firebase
    //   .firestore()
    //   .collection("propiedades")
    //   .doc(id)
    //   .set(propiedadData, { merge: true })
    //   .then(success => {
    //     history.push("/");
    //   });
  };


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
              <Typography color="textPrimary">Editar Inmueble</Typography>
            </Breadcrumbs>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField name='nombrePropiedad' label="Nombre Propiedad" fullWidth value={propiedad.nombrePropiedad || ''} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl className={classes.formControl}>
              <InputLabel id="dormitorios-select-label">
                Tipo Propiedad
              </InputLabel>
              <Select name='tipoPropiedad' labelId="dormitorios-select-label" id="dormitorios-select"
                value={propiedad.tipoPropiedad ? propiedad.tipoPropiedad : ''} onChange={handleChange} className={classes.selectEmpty} >
                <MenuItem value=''>
                  <em>Seleccionar Tipo</em>
                </MenuItem>
                <MenuItem value={"Casa"}>Casa</MenuItem>
                <MenuItem value={"Departamento"}>Departamento</MenuItem>
                <MenuItem value={"ParcelaAgrado"}>Parcela de Agrado</MenuItem>
                <MenuItem value={"Terreno"}>Terreno</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl className={classes.formControl}>
              <InputLabel id="dormitorios-select-label">
                Tipo de Operación
              </InputLabel>
              <Select name='tipoOperacion'
                labelId="dormitorios-select-label"
                id="dormitorios-select"
                value={propiedad.tipoOperacion ? propiedad.tipoOperacion : ''}
                onChange={handleChange}
                className={classes.selectEmpty}
              >
                <MenuItem value="">
                  <em>Seleccionar Operación</em>
                </MenuItem>
                <MenuItem value={"Arriendo"}>Arriendo</MenuItem>
                <MenuItem value={"ArriendoTemporada"}>
                  Arriendo Temporada
                </MenuItem>
                <MenuItem value={"Venta"}>Venta</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={12}>
            <TextField name="direccion" label="Dirección del Inmueble" fullWidth value={propiedad.direccion || ''} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField name="comuna" label="Comuna" fullWidth value={propiedad.comuna || ''} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField name="ciudad" label="Ciudad" fullWidth value={propiedad.ciudad || ''} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField name="pais" label="País" fullWidth value={propiedad.pais || ''} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField name="descripcion" label="Descripción Propiedad" fullWidth value={propiedad.descripcion || ''}  multiline onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField name="precio" label="Precio Propiedad" fullWidth value={propiedad.precio || ''} onChange={handleChange}/>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField name="mtsTotal" label="Mts2 Total Propiedad" fullWidth value={propiedad.mtsTotal || ''} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField name="mtsConstruidos" label="Mts2 Construidos" fullWidth value={propiedad.mtsConstruidos || ''} onChange={handleChange}/>
          </Grid>

          <Grid item xs={12} md={3}>
            {/* <TextField name="mt2" label="Mt2 útiles" fullWidth /> */}
            <FormControl className={classes.formControl}>
              <InputLabel id="dormitorios-select-label">Dormitorios</InputLabel>
              <Select name="dormitorios" labelId="dormitorios-select-label" id="dormitorios-select" value={propiedad.dormitorios ? propiedad.dormitorios : ''} onChange={handleChange} className={classes.selectEmpty} >
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
                <MenuItem value={"+6"}>Más de 6</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            {/* <TextField name="mt2" label="Mt2 útiles" fullWidth /> */}
            <FormControl className={classes.formControl}>
              <InputLabel id="banios-select-label">Baños</InputLabel>
              <Select name="banios" labelId="banios-select-label"
                id="banios-select" value={propiedad.banios ? propiedad.banios : ''}
                onChange={handleChange} className={classes.selectEmpty}
              >
                <MenuItem value="">
                  <em>Seleccionar Baños</em>
                </MenuItem>
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={"+4"}>Más de 4</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <ImageUploader
              key={fotoKey}
              withIcon={true}
              buttonText="Seleccionar Imágenes"
              onChange={subirImagenes}
              // onChange={subirFotos}
              imgExtension={[".jpg", ".png", ".jpeg"]}
              maxFileSize={5242880}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Table>
              <TableBody>
                { propiedad.fotos !== undefined && 
                Object.values(propiedad.fotos).map( (foto, i) => {
                    console.log('foto:: ', foto);
                    return (
                    <TableRow key={i}>
                      <TableCell align="left">
                        <img src={foto} style={style.fotoInmueble} alt="foto" />
                      </TableCell>
                      <TableCell align="left">
                        <Button variant="contained" color="secondary" size="small" onClick={ eliminarFoto(foto) } >Eliminar</Button>
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
          <Grid item xs={12} sm={6}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              size="large"
              color="primary"
              style={style.submit}
              onClick={guardarPropiedad}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default connect(null, {openMensaje})(EditarPropiedad);
