import React from 'react';
import { Link } from "react-router-dom";
import logo from "../icons/logo.svg";
import SearchBar from './SearchBar';

import { UserOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { APP_NAME, HOME_PAGE } from '../constants';

function TopBar(props) {
    const { theme, isLoggedIn, userName, setOpenLoginModal, handleLogout } = props;
    
    const items = [
        {
            label: (
                <a href={`${HOME_PAGE}/list`}>My List</a>
            ),
        },
        {
            label: (
                <a href={`${HOME_PAGE}/orders`}>My Orders</a>
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
                <Link to={`${HOME_PAGE}/home`}>
                    <img src={logo} className="App-logo" alt="logo"/>
                </Link>
                <Link className="App-title" to={`${HOME_PAGE}/home`}>{APP_NAME}</Link>
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