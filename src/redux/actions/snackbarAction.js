export const openMensaje = (openMensaje) => {
    console.log(openMensaje);
    return{
        type: 'OPEN_SNACKBAR',
        openMensaje: openMensaje
    }
}