import React, { useState } from "react";
import { Button, Input, Select, Space, ConfigProvider } from "antd";

import { APP_NAME, SEARCH_TAG } from "../constants";

function SearchBar(props) {
    const [searchType, setSearchType] = useState(SEARCH_TAG.all);
    const [error, setError] = useState("");

    const select_option = Object.keys(SEARCH_TAG).map(item => 
        ({'value': SEARCH_TAG[item], 'label': item}));

    const changeSearchType = (e) => {
        const searchType = e.target.value;
        setSearchType(searchType);
        setError("");
        if (searchType === SEARCH_TAG.all) {
            props.handleSearch({ type: searchType, keyword: "" });
        }
    };

    const handleSearch = (value) => {
        if (searchType !== SEARCH_TAG.all && value === "") {
            setError("Please input your search keyword!");
            return;
        }
        setError("");
        props.handleSearch({ type: searchType, keyword: value });
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: props.colorPrimary,
                },
            }}
        ><Space.Compact style={{ width: '50%' }}>
                <Select defaultValue={0} options={select_option} popupMatchSelectWidth={false}/>
                <Input placeholder={`Search ${APP_NAME}`} />
                <Button type="primary">Search</Button>
            </Space.Compact>
        </ConfigProvider>
    );
}

export default SearchBar;