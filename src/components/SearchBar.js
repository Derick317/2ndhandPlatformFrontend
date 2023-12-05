import React, { useState } from "react";
import { Button, Input, Select, Space, ConfigProvider } from "antd";

import { APP_NAME, TAGS } from "../constants";

function SearchBar(props) {
    const search_tags = {All: 0, ...TAGS}
    const [searchType, setSearchType] = useState(search_tags.All);
    const [error, setError] = useState("");

    const select_option = Object.keys(search_tags).map(item => 
        ({'value': search_tags[item], 'label': item}));

    const changeSearchType = (e) => {
        const searchType = e.target.value;
        setSearchType(searchType);
        setError("");
        if (searchType === search_tags.All) {
            props.handleSearch({ type: searchType, keyword: "" });
        }
    };

    const handleSearch = (value) => {
        if (searchType !== search_tags.All && value === "") {
            setError("Please input your search keyword!");
            return;
        }
        setError("");
        props.handleSearch({ type: searchType, keyword: value });
    };

    return (
        <ConfigProvider theme={props.theme}>
            <Space.Compact style={{ width: '50%' }}>
                <Select defaultValue={0} options={select_option} popupMatchSelectWidth={false}/>
                <Input placeholder={`Search ${APP_NAME}`} />
                <Button type="primary">Search</Button>
            </Space.Compact>
        </ConfigProvider>
    );
}

export default SearchBar;