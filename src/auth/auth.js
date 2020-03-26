import { useState, useEffect } from "react";

import firebase from './../config/configFirebase';
const provider = new firebase.auth.GoogleAuthProvider();

export function useAuthentication() {

    // const [authenticated, setAuthenticated] = useState('cargando');
    const [authenticated, setAuthenticated] = useState(null);

    function login() {
        firebase.auth().signInWithPopup(provider);
    }

    function logout() {
        firebase.auth().signOut().then(() => {
            // console.log('Sesión Cerrada...');
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            // console.log('USUARIO AUTH:: ', user);
            if (user) {
                setAuthenticated(user);
            } else {
                setAuthenticated();
            }
        }, (error) => {
            console.log(error);
        })
    }, []);

    return { login, logout, loggedIn: authenticated };
}