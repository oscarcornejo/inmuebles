import { combineReducers } from 'redux'
import authReducer from './authReducer';
import openSnackbarReducer from './snackbarReducer'

export default combineReducers({ authReducer, openSnackbarReducer })