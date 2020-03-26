import firebase from 'firebase/app';
const firebaseConfig = {
    apiKey: "AIzaSyD4-4idSn9OJUWpPfpQZ3h2S8KTE2UVHdM",
    authDomain: "propiedades-app.firebaseapp.com",
    databaseURL: "https://propiedades-app.firebaseio.com",
    projectId: "propiedades-app",
    storageBucket: "propiedades-app.appspot.com",
    messagingSenderId: "207954204029",
    appId: "1:207954204029:web:646fbb9461bb61a94fe814",
    measurementId: "G-KY93VJ3GD8"
  };
  firebase.initializeApp(firebaseConfig);
  export default firebase;