import { Button, ConfigProvider, Card, Row, Col, message, Image, Empty } from "antd";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import imgPlaceholder from "../icons/image-outline-icon.svg"

import { BASE_URL, ID_KEY, TOKEN_KEY } from "../constants";
function Item(props) {
    const params = useParams()
    const [item, setItem] = useState({})
    const [ordering, setOrdering] = useState(false)

    // fetch information of item first
    useEffect(() => {
        const opt = {
            method: "GET",
            url: `${BASE_URL}/qitem?id=${params.id}`,
        };
        axios(opt).then((res) => {
            if (res.status === 200) {
                const { data } = res;
                setItem(data)
            }
        }).catch((err) => {
            console.log("query item failed: ", err.message);
            message.error("Failed to get item details!");
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const navigate = useNavigate();

    const handleBuyNow = () => {
        setOrdering(true);
        const formData = new FormData();
        formData.append("item_id", item.id);
        const opt = {
            method: "POST",
            url: `${BASE_URL}/addorder`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            },
            data: formData
        };
        axios(opt).then((res) => {
            if (res.status === 200) {
                message.success("Added a new order!");
                setOrdering(false);
                navigate("/orders")
            }
        }).catch((err) => {
            if ("response" in err && err.response.status === 401) {
                props.needLogin()
            } else {
                console.log("Fail to order: ", err.message);
                message.error("Failed to order!");
            }
            setOrdering(false);
        });
    }

    return <div className="item-main">
            <ConfigProvider theme={props.theme}>
            {
            item && Object.keys(item).length > 0 ?
            <Row>
                <Col span={12}>
                    <Card className="item-img-card">
                        <Image
                            className="item-main-image" 
                            src={item.image_urls && Object.keys(item.image_urls).length > 0 ? 
                                item.image_urls[Object.keys(item.image_urls)[0]] : ""} 
                            width="100%"
                            fallback={imgPlaceholder}
                            preview={false}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <div className="item-title">{item.title}</div>
                    <div className="item-price">${item.price}</div>
                    <div className="item-description">{item.description}</div>
                    {
                        localStorage.getItem(ID_KEY) === `${item.seller_id}` ? 
                        <Button className="item-button" type="primary">Edit</Button> :
                        <Button 
                            className="item-button" type="primary"
                            loading={ordering} onClick={handleBuyNow} disabled={ordering}
                        >Buy now!</Button>
                    }
                </Col>
            </Row>
            :
            <Empty description="Item does not exist!">
                <Button className="item-button" type="primary" href="/home">Home</Button>
            </Empty>
            }
            </ConfigProvider>
        </div>
}

export default Item