import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Container, Paper, Grid, Breadcrumbs, Link, TextField, Card, CardMedia, CardContent, CardActions, Button } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { Typography } from "@material-ui/core";

// FIREBASE
import firebase from "./../config/configFirebase";
import "firebase/firestore";

import fotoDefault from "./../logo.svg";

const style = {
  cardGrid: {
    paddingTop: 8,
    paddingBottom: 8
  },
  paper: {
    backgroundColor: "#f5f5f5",
    padding: "20px",
    minHeight: 650
  },
  link: {
    display: "flex"
  },
  gridTextfield: {
    marginTop: "20px"
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%"
  },
  cardContent: {
    flexGrow: 1
  }
};

const ListaPropiedades = ({history}) => {
    const [propiedades, setPropiedades] = useState([]);
    const [terminoBusqueda, setTerminoBusqueda] = useState("");

    useEffect(() => {
        let listaPropiedades = [];
        firebase.firestore().collection("propiedades").orderBy("direccion").get()
        .then( async (resp )=> {
            await resp.docs.forEach(doc => {
                listaPropiedades.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setPropiedades(listaPropiedades);
        });
      
    }, []);

    const cambiarBusquedaTexto = e => {

        setTerminoBusqueda(e.target.value);

        if (terminoBusqueda.typingTimeout) {
            clearTimeout(terminoBusqueda.typingTimeout);
        }

        setTerminoBusqueda({
            name: e.target.value,
            typing: false,
            typingTimeout: setTimeout( goTime => {
                let objectQuery = firebase.firestore().collection("propiedades")
                .orderBy("direccion").where( 
                    "keywords", "array-contains",
                    terminoBusqueda.name.toLowerCase()
                );

                if (terminoBusqueda.name > 1 || terminoBusqueda.name.trim() === "") {
                    objectQuery = firebase.firestore().collection("propiedades").orderBy("direccion");
                }

                objectQuery.get()
                .then( (snapshot) => {
                    const arrayPropiedad = snapshot.docs.map( (doc) => {
                        let data = doc.data();
                        let id = doc.id;
                        return { id, ...data };
                    });
                    console.log("arrayPropiedad:: ", arrayPropiedad);
                    setPropiedades(arrayPropiedad);
                    // console.log("DATA:: ", propiedades);
                }).catch( error => {
                    console.log(error);
                });
            }, 500)
        });
    };

    const eliminarPropiedad = id => {
        firebase.firestore().collection("propiedades").doc(id).delete().then( resp => {
            eliminarPropiedadDelEstado(id)
        })
    }

    const eliminarPropiedadDelEstado = id => {
        const newPropiedades = propiedades.filter( propiedad => propiedad.id !== id );
        setPropiedades(newPropiedades);
    }

    const editarInmueble = (id) => {
        history.push("/editar-propiedad/" + id);
    }

    const verPropiedad = (id) => {
        history.push("/propiedad/" + id);
    }

  
//  const usuarioLogeado = useSelector(state => state.authReducer.usuarioLogeado);
    const usuarioLogeado = useSelector(state => state.authReducer.usuarioLogeado);

  return (
    <Container style={style.cardGrid}>
      <Paper style={style.paper}>
        <Grid item xs={12} md={12}>
          <Breadcrumbs arial-label="breadcrumbs">
            <Link color="inherit" style={style.link} href="/">
              <HomeIcon /> Home
            </Link>
            <Typography color="textPrimary">Mis Propiedades</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12} sm={6} style={style.gridTextfield}>
          <TextField
            onChange={cambiarBusquedaTexto}
            fullWidth
            inputlabelprops={{ shrink: true }}
            name="textoBusqueda"
            variant="outlined"
            label="Ingresar Término de Búsqueda..."
          />
        </Grid>

        <Grid item xs={12} sm={12} style={style.gridTextfield}>
          <Grid container spacing={4}>
            { propiedades.map(item => {
              return (
                <Grid item key={item.id} xs={12} sm={6} md={4}>
                  <Card style={style.card}>
                    <CardMedia
                      style={style.cardMedia}
                      image={
                        item.fotos
                          ? item.fotos[0]
                            ? item.fotos[0]
                            : fotoDefault
                          : fotoDefault
                      }
                      title="Mi Propiedad"
                    />

                    <CardContent style={style.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {`${item.comuna}, ${item.ciudad}`}
                      </Typography>
                    </CardContent>

                    <CardActions>
                        <Button size="small" color="primary" onClick={() => verPropiedad(item.id)}>
                            Ver
                        </Button>
                      {
                        usuarioLogeado &&
                        <Button size="small" color="primary" onClick={() => editarInmueble(item.id)}>
                          Editar
                        </Button>
                      }
                      {
                        usuarioLogeado &&
                      
                        <Button size="small" color="primary" onClick={() => eliminarPropiedad(item.id)}>
                          Eliminar
                        </Button>
                      }
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ListaPropiedades;
