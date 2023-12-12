import { Button, ConfigProvider, Card, Row, Col, message } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";

import { BASE_URL, TOKEN_KEY, ITEM_STATUS, HOME_PAGE } from "../constants";
import { showTag } from "./Tag";

import soldIcon from "../icons/sold-icon.svg"

function List(props) {
    const [itemIDs, setItemIDs] = useState([])
    const [items, setItems] = useState([])

    useEffect(() => {
        const opt = {
            method: "GET",
            url: `${BASE_URL}/qlist`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            },
        };
        axios(opt).then((res) => {
            if (res.status === 200) {
                const { data } = res;
                setItemIDs(data.sort().reverse())
            }
        }).catch((err) => {
            console.log(err)
            if ("response" in err && err.response.status === 401) {
                props.logout()
            } else {
                console.log("query list failed: ", err.message);
                message.error("Failed to show list!");
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Fetch items in the list from backend

    useEffect(() => {
        setItems(arg => [])
        itemIDs.forEach((itemId) => {
            const opt = {
                method: "GET",
                url: `${BASE_URL}/qitem?id=${itemId}`,
            };
            axios(opt).then((res) => {
                if (res.status === 200) {
                    const { data } = res;
                    setItems(arg => [...arg, data])
                }
            }).catch((err) => {
                console.log("query item failed: ", err.message);
                message.error("Failed to get item details!");
            });
        });
        setItems(array => array.sort((item1, item2) => item1.id - item2.id))
    }, [itemIDs]) // Fetch item's details from backend

    const deleteItem = (itemId) => {
        setItemIDs(itemIDs.filter(id => id !== itemId))
    };

    return <div className="list-main">
        <ConfigProvider theme={props.theme}>
            <span style={{ fontWeight: "bold", fontSize: "large" }}>My List</span>
            <Button type="primary" style={{ float: "right" }} href={`${HOME_PAGE}/upload`}>
                New Item
            </Button>
            {
                items.map( (item, index) => <ListCard
                    itemId={item.id}
                    key={index}
                    title={item.title}
                    tag={item.tag}
                    price={item.price}
                    imgUrl={item.image_urls && Object.keys(item.image_urls).length > 0 ? 
                        item.image_urls[Object.keys(item.image_urls)[0]] : ""}
                    status={item.status}
                    afterDelete={deleteItem}
                    imgOnError={props.imgOnError}
                />)
            }
        </ConfigProvider>
    </div>
}

function ListCard(props) {
    const { itemId, title, tag, price, imgUrl, status, afterDelete, imgOnError } = props;
    const [ deleting, setDeleting ] = useState(false);

    const handleDelete = () => {
        setDeleting(true)
        const formData = new FormData();
        formData.append("item_id", itemId);
        const opt = {
            method: "DELETE",
            url: `${BASE_URL}/ditem`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            },
            data: formData
        };
        axios(opt).then((res) => {
            if (res.status === 200) {
                afterDelete(itemId)
                setDeleting(false)
            }
        }).catch((err) => {
            console.log("delete item failed: ", err.message);
            message.error("Failed to delete item!");
            setDeleting(false)
        });
    };

    return <Card style={{marginTop: "20px"}}>
        <Row>
            <Col span={4}>
                <div className="list-card-title">{title}</div>
                { showTag(tag) }
                <div className="list-card-price">${price}</div>
            </Col>
            <Col span={3}>
                {
                    status === ITEM_STATUS.Sold ? 
                    <img src={soldIcon} style={{width: "max(70%, 100px)"}} alt=""/> : 
                    <><Button style={{width: "100px"}} type="primary">Edit</Button>
                    <Button 
                        style={{marginTop: "5px", width: "100px"}} 
                        type="primary"
                        href={`${HOME_PAGE}/item/${itemId}`}
                        target="_blank"
                    >View</Button></>
                }
                <Button 
                    style={{marginTop: "5px", width: "100px"}}
                    type="primary"
                    onClick={handleDelete}
                    loading={deleting}
                    disabled={deleting}
                >
                    Delete
                </Button>
            </Col>
            <Col span={4} offset={13}>
                <img 
                    className="list-card-image"
                    src={imgUrl}
                    width="120px"
                    onError={imgOnError}
                    alt=""
                />
            </Col>
        </Row>
    </Card>
}


export default List;