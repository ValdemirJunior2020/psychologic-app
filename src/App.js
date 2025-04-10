import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import InputForm from "./components/InputForm";
import { auth } from "./firebase/config";
import "./index.css";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <h1>Psychology Support App</h1>
      {user ? (
        <InputForm user={user} />
      ) : (
        <Login onLogin={() => setUser(auth.currentUser)} />
      )}
    </div>
  );
};

export default App;
