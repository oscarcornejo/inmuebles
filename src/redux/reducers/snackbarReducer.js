const initialState = {
    open: false,
    mensaje: ''
}

const openSnackbarReducer = (state = initialState, action) => {
    // console.log('ACTION:: ', action.openMensaje);
    switch (action.type) {
        case 'OPEN_SNACKBAR':
            return{
                ...state, 
                open: action.open,
                mensaje: action.mensaje
            }
        default:
            return state;
    }
};

export default openSnackbarReducer;