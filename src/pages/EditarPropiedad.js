import React, { useState, useEffect } from "react";
import {
  Paper,
  Container,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";
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

const EditarPropiedad = props => {
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
  const [archivos, setArchivos] = useState([]);
  const [propiedad, setPropiedad] = useState({});

  const [values, setValues] = useState({});

  const { id } = props.match.params;

  useEffect(() => {
    const fetchData = async () => {
      await firebase
        .firestore()
        .collection("propiedades")
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

    firebase.firestore().collection("propiedades").doc(id).set(propiedadData, { merge: true })
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
      .collection("propiedades")
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
              <Typography color="textPrimary">Editar Inmueble</Typography>
            </Breadcrumbs>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name='nombrePropiedad'
              label="Nombre Propiedad"
              fullWidth
              value={nombrePropiedad || ''}
              onChange={e => setNombrePropiedad(e.target.value)}
                // value={nombrePropiedad || ''}
                // onChange={cambiarDato}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl className={classes.formControl}>
              <InputLabel id="dormitorios-select-label">
                Tipo Propiedad
              </InputLabel>
              <Select name='tipoPropiedad'
                labelId="dormitorios-select-label"
                id="dormitorios-select"
                value={tipoPropiedad ? tipoPropiedad : ''}
                onChange={e => setTipoPropiedad(e.target.value)}
                className={classes.selectEmpty}
              >
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
                value={tipoOperacion ? tipoOperacion : ''}
                onChange={e => setTipoOperacion(e.target.value)}
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
            <TextField
              name="direccion"
              label="Dirección del Inmueble"
              fullWidth
              value={direccion || ''}
              onChange={e => setDireccion(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              name="comuna"
              label="Comuna"
              fullWidth
              value={comuna || ''}
              onChange={e => setComuna(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              name="ciudad"
              label="Ciudad"
              fullWidth
              value={ciudad || ''}
              onChange={e => setCiudad(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              name="pais"
              label="País"
              fullWidth
              value={pais || ''}
              onChange={e => setPais(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              name="descripcion"
              label="Descripción Propiedad"
              fullWidth
              value={descripcion || ''}
              multiline
              onChange={e => setDescripcion(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              name="precio"
              label="Precio Propiedad"
              fullWidth
              value={precio || ''}
              onChange={e => setPrecio(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              name="mtsTotal"
              label="Mts2 Total Propiedad"
              fullWidth
              value={mtsTotal || ''}
              onChange={e => setMtsTotal(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              name="mtsConstruidos"
              label="Mts2 Construidos"
              fullWidth
              value={mtsConstruidos || ''}
              onChange={e => setMtsConstruidos(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            {/* <TextField name="mt2" label="Mt2 útiles" fullWidth /> */}
            <FormControl className={classes.formControl}>
              <InputLabel id="dormitorios-select-label">Dormitorios</InputLabel>
              <Select name="dormitorios"
                labelId="dormitorios-select-label"
                id="dormitorios-select"
                value={dormitorios ? dormitorios : ''}
                onChange={e => setDormitorios(e.target.value)}
                className={classes.selectEmpty}
              >
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
              <Select name="banios"
                labelId="banios-select-label"
                id="banios-select"
                value={banios ? banios : ''}
                onChange={e => setBanios(e.target.value)}
                className={classes.selectEmpty}
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
              imgExtension={[".jpg", ".png", ".jpeg"]}
              maxFileSize={5242880}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Table>
              <TableBody>
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
                        <TableCell align="left">
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={ eliminarFoto(foto) }
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                      )
                    })
                  : null}
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

export default EditarPropiedad;
