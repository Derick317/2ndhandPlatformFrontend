import { Routes, Route, Navigate } from 'react-router';

import Upload from "./Upload";
import Orders from "./Orders";
import { Home, SearchResult } from "./Home";
import List from "./List"
import Item from './Item';
import imgPlaceholder from "../icons/image-outline-icon.svg"
import { ROOT_PATH } from '../constants';

function Main(props) {
    const { theme, isLoggedIn, needLogin, logout, scrollWidth } = props;
    const loggedInOrHome = (obj) => {
        return isLoggedIn ? obj : <Navigate to={`${ROOT_PATH}/home`}/>
    }
    const handleImgOnError = (event) => {
		event.target.src = imgPlaceholder;
	}

    const home = <Home scrollWidth={scrollWidth} imgOnError={handleImgOnError}/>;
    return (
        <div className="main">
            <div className='main-content'>
            <Routes>
                <Route path={`${ROOT_PATH}/`} exact element={home} />
                <Route path={`${ROOT_PATH}/upload`} element={loggedInOrHome(<Upload theme={theme}/>)}/>
                <Route path={`${ROOT_PATH}/list`} element={loggedInOrHome(<List 
                    theme={theme}
                    imgOnError={handleImgOnError}
                    logout={logout}
                />)}/> 
                <Route path={`${ROOT_PATH}/orders`} element={loggedInOrHome(<Orders
                    theme={theme}
                    imgOnError={handleImgOnError}
                    logout={logout}
                />)}/>
                <Route path={`${ROOT_PATH}/home`} element={home} />
                <Route path={`${ROOT_PATH}/search`} element={<SearchResult
                    scrollWidth={scrollWidth}
                    imgOnError={handleImgOnError}
                />}/>
                <Route path={`${ROOT_PATH}/item/:id`} element={<Item theme={theme} 
                    needLogin={needLogin}
                />}/>
            </Routes>
            </div>
            <footer className='footer'>
                Copyright &copy; 2024, 陈德铭 &emsp;
                <a
                    href='https://derick317.github.io'
                    style={{textDecoration: "none", color: "inherit"}}
                    target="_blank"
                    rel="noreferrer"
                >Home Page</a>&emsp;
                <a
                    href='https://github.com/Derick317/2ndhandPlatformFrontend.git'
                    style={{textDecoration: "none", color: "inherit"}}
                    target="_blank"
                    rel="noreferrer"
                >Front End</a>&emsp;
                <a
                    href='https://github.com/Derick317/2ndhandPlatformBackend.git'
                    style={{textDecoration: "none", color: "inherit"}}
                    target="_blank"
                    rel="noreferrer"
                >Back End</a>
            </footer>       
        </div>
    );
}

export default Main;