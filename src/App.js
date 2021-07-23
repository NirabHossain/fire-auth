// import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.apps.length?firebase.app() : firebase.initializeApp(firebaseConfig);

function App() {
  const [userInfo, setUserInfo] = useState({ name: '', email: '', photo: '', isSignedIn: false, password: '', error: '', msg: '', newUser: false });
  const [newUser, setNewUser] = useState(false);

  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider).then(res => {
      const { displayName, email, photoURL } = res.user;
      const signedUser = { name: displayName, email: email, photo: photoURL, isSignedIn: true };
      setUserInfo(signedUser);
    }).catch(err => console.log(err.message));
  }

  const handleSignOut = () => {
    firebase.auth().signOut().then(res => {
      const unSignedUser = { name: '', email: '', photo: '', isSignedIn: false };
      setUserInfo(unSignedUser);
    }).catch(err => console.log(err.message));
  }

  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider).then((result) => {
      const user = result.user;
      console.log('Facebook user: ', user);
    })
      .catch((error) => {
        console.log(error.code);
      });
  }











  const handleSubmit = (e) => {
    // console.log(userInfo.email, userInfo.password);
    if (newUser && userInfo.email && userInfo.password) {
      firebase.auth().createUserWithEmailAndPassword(userInfo.email, userInfo.password)
        .then((userCredential) => {
          const newUserInfo = { ...userInfo };
          newUserInfo.msg = 'Sign up successful';
          newUserInfo.error = "";
          setUserInfo(newUserInfo);
          updateUserName(userInfo.name);
        })
        .catch((error) => {
          const newUserInfo = { ...userInfo };
          newUserInfo.error = error.message;
          newUserInfo.msg = '';
          setUserInfo(newUserInfo);
        });
    }

    if (!newUser && userInfo.email && userInfo.password) {
      firebase.auth().signInWithEmailAndPassword(userInfo.email, userInfo.password)
        .then((userCredential) => {
          const newUserInfo = { ...userInfo };
          newUserInfo.msg = 'Sign in successful';
          newUserInfo.error = "";
          setUserInfo(newUserInfo);
          console.log('Sign in user info', userCredential.user);
        })
        .catch((error) => {
          const newUserInfo = { ...userInfo };
          newUserInfo.error = error.message;
          newUserInfo.msg = '';
          setUserInfo(newUserInfo);
        });
    }

    e.preventDefault();
  }





  const handleChange = (event) => {
    let isFieldValid = true;
    if (event.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if (event.target.name === 'password') {
      isFieldValid = event.target.value.length > 6 && /\d{1}/.test(event.target.value);
    }
    if (isFieldValid) {
      const newUserInfo = { ...userInfo };
      newUserInfo[event.target.name] = event.target.value;
      setUserInfo(newUserInfo);
    }
    else {
      const newUserInfo = { ...userInfo };
      newUserInfo[event.target.name] = null;
      setUserInfo(newUserInfo);
    }
  }



  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
      // photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(() => {
      console.log('Update successful')
    }).catch((error) => {
      console.log('An error occurred');
    });
  }





















  const { name, email, photo, password, isSignedIn } = userInfo;

  return (
    <div className="App">

      {
        !isSignedIn ? <button onClick={handleSignIn}>Sign in</button> : <button onClick={handleSignOut}>Sign out</button>
      }

      <button onClick={handleFbSignIn}>Sign in using facebook</button>

      {isSignedIn && <div>
        <h1>Welcome: {name}</h1>
        <h2>Email: {email}</h2>
        <img src={photo} alt="" />
      </div>}

      <h1>Our own authentication system</h1>
      <h2>Name: {name}</h2>
      <h3>Email: {email}</h3>
      <p>Password: {password}</p>

      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">User Registration</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" id="" onBlur={handleChange} placeholder='Name' required />}<br />
        <input type="text" name="email" id="" onBlur={handleChange} placeholder='Email address' required /><br />
        <input type="password" name="password" id="" placeholder='Password' onBlur={handleChange} required /><br />
        <input type="submit" value="Submit" />

      </form>
      <p style={{ color: 'red' }}>{userInfo.error}</p>
      <p style={{ color: 'blue' }}>{userInfo.msg}</p>
    </div>
  );
}

export default App;
