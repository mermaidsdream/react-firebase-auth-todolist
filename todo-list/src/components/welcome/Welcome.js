import { useState, useEffect } from "react";

import "./welcome.css";
import { FirebaseError } from "firebase/app";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

import initializeAuthentication from "../firebase/firebase.init";
initializeAuthentication();
const provider = new GoogleAuthProvider();

const handleGoogleSignIn = () => {
  const auth = getAuth();

  signInWithPopup(auth, provider).then((result) => {
    const user = result.user;
    console.log(user);
  });
};

export const Welcome = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerInformation, setRegisterInformation] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/homepage");
      }
    });
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/homepage");
      })
      .catch((err) => alert(err.message));
  };

  const handleRegister = () => {
    if (registerInformation.email !== registerInformation.confirmEmail) {
      alert("Please confirm that email are the same");
      return;
    } else if (
      registerInformation.password !== registerInformation.confirmPassword
    ) {
      alert("Please confirm that password are the same");
      return;
    }
    createUserWithEmailAndPassword(
      auth,
      registerInformation.email,
      registerInformation.password
    )
      .then(() => {
        navigate("/homepage");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="section-welcome">
      <h1>ToDo list</h1>
      <div className="login-register-container">
        {isRegistering ? (
          <>
            <input
              className="input-email"
              type="email"
              placeholder="Email"
              value={registerInformation.email}
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  email: e.target.value,
                })
              }
            />
            <input
              className="input-email"
              type="email"
              placeholder="Confirm email"
              value={registerInformation.confirmEmail}
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  confirmEmail: e.target.value,
                })
              }
            />
            <input
              className="input-password"
              type="password"
              placeholder="Password"
              value={registerInformation.password}
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  password: e.target.value,
                })
              }
            />
            <input
              className="input-password"
              type="password"
              placeholder="Confirm password"
              value={registerInformation.confirmPassword}
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  confirmPassword: e.target.value,
                })
              }
            />
            <button className="button-register" onClick={handleRegister}>
              Register
            </button>
            <button
              className="button-goback"
              onClick={() => setIsRegistering(false)}
            >
              Go Back
            </button>
          </>
        ) : (
          <>
            <input
              className="input-email"
              type="email"
              onChange={handleEmailChange}
              value={email}
            />
            <input
              className="input-password"
              type="password"
              onChange={handlePasswordChange}
              value={password}
            />
            <button className="button-signin" onClick={handleSignIn}>
              Sign In
            </button>
            <button
              className="button-isregistering"
              onClick={() => setIsRegistering(true)}
            >
              Create an account
            </button>
            <button
              className="button-signingoogle"
              onClick={handleGoogleSignIn}
            >
              Sing In with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
};
