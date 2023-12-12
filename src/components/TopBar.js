import React from 'react';
import { Link } from "react-router-dom";
import logo from "../icons/logo.svg";
import SearchBar from './SearchBar';

import { UserOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { APP_NAME, ROOT_PATH } from '../constants';

function TopBar(props) {
    const { theme, isLoggedIn, userName, setOpenLoginModal, handleLogout } = props;
    
    const items = [
        {
            label: (
                <Link to={`${ROOT_PATH}/list`}>My List</Link>
            ),
        },
        {
            label: (
                <Link to={`${ROOT_PATH}/orders`}>My Orders</Link>
            ),
        },
        {
            label: (
                <span onClick={() => handleLogout()}>Sign out</span>
            ),
        }
    ];
    return (
        <>
            <header className="App-header">
                <Link to={`${ROOT_PATH}/home`}>
                    <img src={logo} className="App-logo" alt="logo"/>
                </Link>
                <Link className="App-title" to={`${ROOT_PATH}/home`}>{APP_NAME}</Link>
                <SearchBar theme={theme}></SearchBar>
                {
                    isLoggedIn ?
                        <Dropdown
                            menu={{
                                items,
                            }}
                        >
                            <span onClick={(e) => e.preventDefault()} className='login-user'>
                                &ensp;{userName}&ensp;
                            </span>
                        </Dropdown> :
                        <span className='login-user' onClick={() => setOpenLoginModal(true)}>
                            &ensp;<UserOutlined />&ensp;Sign in&ensp;
                        </span>
                }
            </header>
        </>
    );
}

export default TopBar;