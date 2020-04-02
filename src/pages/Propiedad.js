import React, { useState, useEffect } from "react";
import {Paper,Container,Grid, Breadcrumbs, Link, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Table, TableRow, TableCell, TableBody, Divider } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import ImageUploader from "react-images-upload";
import uuid from "uuid";

import { makeStyles } from "@material-ui/core/styles";

import { crearKeyword } from "../redux/actions/Keyword";

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

const Propiedad = props => {
  const classes = useStyles();
  const uniqueID = uuid.v4();
  const fotoKey = uuid.v4();

  const { history, openMensaje } = props;

  const [nombrePropiedad, setNombrePropiedad] = useState("");
  const [tipoPropiedad, setTipoPropiedad] = useState("");
  const [tipoOperacion, setTipoOperacion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [pais, setPais] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mtsTotal, setMtsTotal] = useState(0);
  const [mtsConstruidos, setMtsConstruidos] = useState(0);
  const [dormitorios, setDormitorios] = useState(0);
  const [banios, setBanios] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [fotos, setFotos] = useState([]);
  const [propiedad, setPropiedad] = useState({});
  
  // const [archivos, setArchivos] = useState([]);
  // const [values, setValues] = useState({});

  const { id } = props.match.params;

  useEffect(() => {
    const fetchData = async () => {
      await firebase
        .firestore()
        .collection("inmuebles")
        .doc(id)
        .get()
        .then(resp => {
          console.log(resp.data());
          setPropiedad(resp.data());
          setNombrePropiedad(propiedad.nombrePropiedad);
          setTipoPropiedad(propiedad.tipoPropiedad);
          setTipoOperacion(propiedad.tipoOperacion);
          setDireccion(propiedad.direccion);
          setComuna(propiedad.comuna);
          setCiudad(propiedad.ciudad);
          setPais(propiedad.pais);
          setDescripcion(propiedad.descripcion);
          setMtsTotal(propiedad.mtsTotal);
          setMtsConstruidos(propiedad.mtsConstruidos);
          setDormitorios(propiedad.dormitorios);
          setBanios(propiedad.banios);
          setPrecio(propiedad.precio);
          setFotos(propiedad.fotos);
        });
    };
    fetchData();
  }, [
        id,
        propiedad.nombrePropiedad,
        propiedad.tipoPropiedad,
        propiedad.tipoOperacion,
        propiedad.direccion,
        propiedad.comuna,
        propiedad.ciudad,
        propiedad.pais,
        propiedad.descripcion,
        propiedad.mtsTotal,
        propiedad.mtsConstruidos,
        propiedad.dormitorios,
        propiedad.banios,
        propiedad.precio
    ]);

    // const cambiarDato = e => {
    //     setValues(values => ({ ...values, [e.target.name]: e.target.value }));
    // }

  const subirImagenes = imagenes => {
    // const {id} = props.match.params;

    const propiedadData = {
      nombrePropiedad,
      tipoPropiedad,
      tipoOperacion,
      direccion,
      comuna,
      ciudad,
      pais,
      descripcion,
      mtsTotal,
      mtsConstruidos,
      dormitorios,
      banios,
      precio,
      fotos,
      keywords: null
      // archivos
    };

    //agregar un nombre dinamico por cada imagen que necesites subir al firestorage

    Object.keys(imagenes).forEach(key => {
      let codigoDinamico = uuid.v4();
      let nombreImagen = imagenes[key].name;
      let extension = nombreImagen.split(".").pop();
      imagenes[key].alias = (
        nombreImagen.split(".")[0] +
        "_" +
        codigoDinamico +
        "." +
        extension
      )
        .replace(/\s/g, "_")
        .toLowerCase();
    });

    this.props.firebase.guardarDocumentos(imagenes).then(urlImagenes => {
      propiedadData.fotos = urlImagenes;
      setFotos(urlImagenes);

      this.props.firebase.db
        .collection("Inmuebles")
        .doc(id)
        .set(propiedadData, { merge: true })
        .then(success => {
          setPropiedad(propiedadData);
        });
    });
  };

  const eliminarFoto = fotoUrl => () => {
    // const {id} = props.match.params;
    console.log('LLegué!');

    let fotoID = fotoUrl.match(/[\w-]+.(jpg|png|jepg|gif|svg)/);
    fotoID = fotoID[0];

    firebase.storage().ref().child(fotoID).delete();

    let fotoList = Object.values(fotos).filter(foto => {
        return foto.name !== fotoUrl
    });

    

    // setFotos(Object.values(fotos).filter(foto => {
    //     return foto.name !== fotoUrl
    // }));

    // setFotos(fotoList);

    const propiedadData = {
        nombrePropiedad,
        tipoPropiedad,
        tipoOperacion,
        direccion,
        comuna,
        ciudad,
        pais,
        descripcion,
        mtsTotal,
        mtsConstruidos,
        dormitorios,
        banios,
        precio,
        fotos: fotoList,
        keywords: null
        // archivos
      };

    firebase.firestore().collection("inmuebles").doc(id).set(propiedadData, { merge: true })
      .then(success => {
        setPropiedad(propiedadData);
      });
  };

  const guardarPropiedad = () => {
    const { id } = props.match.params;

    const propiedadData = {
      nombrePropiedad,
      tipoPropiedad,
      tipoOperacion,
      direccion,
      comuna,
      ciudad,
      pais,
      descripcion,
      mtsTotal,
      mtsConstruidos,
      dormitorios,
      banios,
      precio,
      fotos,
      keywords: null
      // archivos
    };

    const textoBusqueda =
      propiedadData.direccion +
      " " +
      propiedadData.ciudad +
      " " +
      propiedadData.pais;
    const keyWords = crearKeyword(textoBusqueda);

    propiedadData.keywords = keyWords;

    firebase
      .firestore()
      .collection("inmuebles")
      .doc(id)
      .set(propiedadData, { merge: true })
      .then(success => {
        history.push("/");
      });
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
              <Typography color="textPrimary">Inmueble</Typography>
            </Breadcrumbs>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography >Nombre Propiedad: {nombrePropiedad || ''}</Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography >Tipo Propiedad: {tipoPropiedad ? tipoPropiedad : ''}</Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography> Tipo Operación: {tipoOperacion ? tipoOperacion : ''}</Typography>
          </Grid>

          <Grid item xs={12} md={12}>
            <Typography >Dirección: {direccion || ''}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography >Comuna: {comuna || ''}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography >Ciudad: {ciudad || ''}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography >País: {pais || ''}</Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography >Descripción: {descripcion || ''}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography >Precio: {precio || ''}</Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography >Mts. Total: {mtsTotal || ''}</Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography >Mts. Construidos: {mtsConstruidos || ''}</Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography >Dormitorios: {dormitorios ? dormitorios : ''}</Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography >Baños: {banios ? banios : ''}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Table>
              <TableBody>
                <Divider />
                
                {fotos
                  ? Object.values(fotos).map((foto, i) => {

                      console.log('foto:: ', foto);
                      return (
                      <TableRow key={i}>
                        <TableCell align="left">
                          <img
                            src={foto}
                            style={style.fotoInmueble}
                            alt="foto"
                          />
                        </TableCell>
                      </TableRow>
                      )
                    })
                  : null}
              </TableBody>
            </Table>
          </Grid>
        </Grid>

        
      </Paper>
    </Container>
  );
};

export default Propiedad;
