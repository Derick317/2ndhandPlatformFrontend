import React from 'react';
import logo from "../logo.svg";
import SearchBar from './SearchBar';
import LoginModal from './login';

import { UserOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { APP_NAME } from '../constants';

function TopBar(props) {
    const { isLoggedIn, userName, handleLoggedIn, handleLogout } = props;
    const [openLoginModal, setOpenLoginModal] = React.useState(false)
    const items = [
        {
            key: '1',
            label: (
                <span onClick={() => handleLogout()}>Sign out</span>
            ),
        },
        {
            key: '4',
            danger: true,
            label: 'a danger item',
        },
    ];
    return (
        <>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <span className="App-title">{APP_NAME}</span>
                <SearchBar colorPrimary='#EBC061'></SearchBar>
                {
                    isLoggedIn ?
                        <Dropdown
                            menu={{
                                items,
                            }}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                            <span className='login-user'>&ensp;{userName}&ensp;</span>
                            </a>
                        </Dropdown> :
                        <span className='login-user' onClick={() => setOpenLoginModal(true)}>
                            &ensp;<UserOutlined />&ensp;Sign in&ensp;
                        </span>
                }
            </header>
            <LoginModal 
                open={openLoginModal} 
                setOpen={setOpenLoginModal}
                handleLoggedIn={handleLoggedIn}
                colorPrimary='#EBC061'
            />
        </>
    );
}

export default TopBar;