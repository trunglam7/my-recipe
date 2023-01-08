import React from "react";
import LoginPage from "./components/LoginPage";
import firebase from 'firebase/compat/app';
import {getStorage} from 'firebase/storage';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import {useAuthState} from 'react-firebase-hooks/auth';
import HomePage from "./components/HomePage";


const firebaseConfig = {
  apiKey: "AIzaSyASI1tcIBaDAbx-kjZr4K-VCUebZu6QXe8",
  authDomain: "my-recipes-a4cec.firebaseapp.com",
  projectId: "my-recipes-a4cec",
  storageBucket: "my-recipes-a4cec.appspot.com",
  messagingSenderId: "15412561199",
  appId: "1:15412561199:web:148a568ddc9e21a33c8dda",
  measurementId: "G-CRN40QN99H"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const storage = getStorage(firebaseApp);

function App() {

  const [user] = useAuthState(auth);

  const signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div className="App">
      {user ? <HomePage auth={auth} user={user} app={firebaseApp} storage={storage}/> : <LoginPage signIn={signIn}/>}
    </div>
  );
}

export default App;
