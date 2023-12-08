import { Routes, Route, Navigate } from 'react-router';

import Upload from "./Upload";
import Orders from "./Orders";
import { Home, SearchResult } from "./Home";
import List from "./List"
import Item from './Item';

function Main(props) {
    const { theme, isLoggedIn, needLogin, scrollWidth } = props;
    const loggedInOrHome = (obj) => {
        return isLoggedIn ? obj : <Navigate to='/home'/>
    }
    const home = <Home scrollWidth={scrollWidth}/>;
    return (
        <div className="main">
            <Routes>
                <Route path="/" exact element={home} />
                <Route path="/upload" element={loggedInOrHome(<Upload theme={theme}/>)}/>
                <Route path="/list" element={loggedInOrHome(<List theme={theme}/>)}/> 
                <Route path="/orders" element={loggedInOrHome(<Orders theme={theme}/>)} />
                <Route path="/home" element={home} />
                <Route path="/search" element={<SearchResult scrollWidth={scrollWidth}/>}/>
                <Route path="/item/:id" element={<Item theme={theme} needLogin={needLogin}/>}/>
            </Routes>
        </div>
    );
}

export default Main;