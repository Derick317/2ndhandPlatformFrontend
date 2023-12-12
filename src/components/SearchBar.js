import React, { useState } from "react";
import { Button, Input, Select, Space, ConfigProvider } from "antd";
import { APP_NAME, TAGS } from "../constants";
import { useNavigate } from "react-router-dom";

function SearchBar({theme}) {
    const search_tags = {All: 0, ...TAGS}
    const [searchType, setSearchType] = useState(search_tags.All);
    const [searchText, setSearchText] = useState("")

    const select_option = Object.keys(search_tags).map(item => 
        ({'value': search_tags[item], 'label': item}));

    const changeSearchType = (value) => {
        setSearchType(value);
    };

    const changeSearchText = (e) => {
        setSearchText(e.target.value);
    };

    const navigate = useNavigate();

    const handleSearch = () => {
        setSearchText(arg => arg.trim())
        navigate(searchText ? `/search?tag=${searchType}&keywords=${searchText}` :
        `/search?tag=${searchType}`);
    };

    return (
        <ConfigProvider theme={theme}>
            <Space.Compact style={{ width: '50%' }}>
                <Select defaultValue={0} options={select_option} popupMatchSelectWidth={false}
                    value={searchType} onChange={changeSearchType}
                />
                <Input placeholder={`Search ${APP_NAME}`} maxLength={30} 
                    value={searchText} onChange={changeSearchText}
                />
                <Button type="primary" onClick={handleSearch}>Search</Button>
            </Space.Compact>
        </ConfigProvider>
    );
}

export default SearchBar;