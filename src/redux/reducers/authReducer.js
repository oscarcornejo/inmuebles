const INITIAL_STATE = {
    usuario: {
        nombre: '',
        apellido: '',
        email:  '',
        foto: '',
        telefono: '',
        usuarioId: ''
    },
    usuarioLogeado: false
};

function authReducer(state = INITIAL_STATE, action){
    // console.log('usuarioReducer:: ', action);
    switch (action.type) {
        case 'LOGIN':
            return { ...state, usuario: action.sesion, usuarioLogeado: action.usuarioLogeado};
        case 'CAMBIAR_SESION':
            return { ...state, usuario: action.nuevoUsuario, usuarioLogeado: action.usuarioLogeado};
        case 'LOGOUT':
            return { ...state, usuario: action.nuevoUsuario, usuarioLogeado: action.usuarioLogeado};
        default:
            return state;
    }
}

export default authReducer;