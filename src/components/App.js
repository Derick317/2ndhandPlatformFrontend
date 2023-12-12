import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import Main from "./Main"
import LoginModal from './login';

import { TOKEN_KEY, USERNAME_KEY, ID_KEY } from "../constants";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem(TOKEN_KEY) ? true : false);
  const [userName, setUserName] = useState(localStorage.getItem(USERNAME_KEY));
  const [openLoginModal, setOpenLoginModal] = React.useState(false);
  const [scrollWidth, setScrollWidth] = useState(document.documentElement.scrollWidth);
  const theme = {
    token: {
      colorPrimary: '#EBC061',
    },
  };

  useEffect(() => {
    window.addEventListener('resize', handleScrollWidth);
    return () => {window.removeEventListener('resize', handleScrollWidth);}
  }, []);

  const handleScrollWidth = () => {
    setScrollWidth(document.documentElement.scrollWidth);
  };

  const logout = () => {
    console.log("log out");
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ID_KEY)
    setIsLoggedIn(false);
  };

  const loggedIn = (token, username, id) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USERNAME_KEY, username)
      localStorage.setItem(ID_KEY, id)
      setUserName(username)
      setIsLoggedIn(true);
    }
  };

  const needLogin = () => { setOpenLoginModal(true); }

  return (
    <div className="App">
      <TopBar
        theme={theme}
        isLoggedIn={isLoggedIn}
        userName={userName}
        handleLoggedIn={loggedIn}
        setOpenLoginModal={setOpenLoginModal}
        handleLogout={logout}
      />
      <Main
        theme={theme}
        isLoggedIn={isLoggedIn}
        needLogin={needLogin}
        logout={logout}
        scrollWidth={scrollWidth}
      />
      <LoginModal
        theme={theme}
        open={openLoginModal}
        setOpen={setOpenLoginModal}
        handleLoggedIn={loggedIn}
      />
    </div>
  );
}

export default App;
