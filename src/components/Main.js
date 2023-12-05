import { Routes, Route, Navigate } from 'react-router';

import Upload from "./Upload";
import Orders from "./Orders";
import Home from "./Home";
import List from "./List"
import Item from './Item';

function Main(props) {
    const { theme, isLoggedIn, needLogin } = props;
    const loggedInOrHome = (obj) => {
        return isLoggedIn ? obj : <Navigate to='/home'/>
    }
    return (
        <div className="main">
            <Routes>
                <Route path="/" exact element={<Home/>} />
                <Route path="/upload" element={loggedInOrHome(<Upload theme={theme}/>)}/>
                <Route path="/list" element={loggedInOrHome(<List theme={theme}/>)}/> 
                <Route path="/orders" element={loggedInOrHome(<Orders theme={theme}/>)} />
                <Route path="/home" element={<Home/>} />
                <Route path="/item/:id" element={<Item theme={theme} needLogin={needLogin}/>}/>
            </Routes>
        </div>
    );
}

export default Main;