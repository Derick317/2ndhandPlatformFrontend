import React, { useState } from "react";
import TopBar from "./TopBar";
import Main from "./Main"

import { TOKEN_KEY, USERNAME_KEY } from "../constants";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem(TOKEN_KEY) ? true : false
    // true
  );
  const [userName, setUserName] = useState("")

  const logout = () => {
    console.log("log out");
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY)
    setIsLoggedIn(false);
  };

  const loggedIn = (token, username) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USERNAME_KEY, username)
      setUserName(username)
      setIsLoggedIn(true);
    }
  };
  return (
    <div className="App">
      <TopBar 
        isLoggedIn={isLoggedIn} 
        userName={userName}
        handleLoggedIn={loggedIn}
        handleLogout={logout}
      />
      <Main isLoggedIn={isLoggedIn} handleLoggedIn={loggedIn}/>
    </div>
  );
}

export default App;
