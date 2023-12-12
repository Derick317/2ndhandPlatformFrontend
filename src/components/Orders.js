import { Button, ConfigProvider, Card, Row, Col, message, Statistic } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "../constants";
import { showTag } from "./Tag";
import expiredIcon from "../icons/expire-icon.svg"

function Orders(props) {
    const [itemIDs, setItemIDs] = useState({})
    const [items, setItems] = useState([])

    const removeOrder = (itemId) => {
        setItemIDs(arg => arg.filter(id => id !== itemId))
    }

    useEffect(() => {
        const opt = {
            method: "GET",
            url: `${BASE_URL}/qorder`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            },
        };
        axios(opt).then((res) => {
            if (res.status === 200) {
                const { data } = res;
                setItemIDs(data)
            }
        }).catch((err) => {
            if ("response" in err && err.response.status === 401) {
                props.logout()
            } else {
                console.log("query orders failed: ", err.message);
                message.error("Failed to show orders!");
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Fetch ids of items in the order from backend

    useEffect(() => {
        setItems(arg => [])
        Object.keys(itemIDs).forEach((itemId) => {
            const opt = {
                method: "GET",
                url: `${BASE_URL}/qitem?id=${itemId}`,
            };
            axios(opt).then((res) => {
                if (res.status === 200) {
                    const { data } = res;
                    data["remainTime"] = itemIDs[itemId]
                    setItems(arg => [...arg, data])
                }
            }).catch((err) => {
                console.log("query item failed: ", err.message);
                message.error("Failed to get item details!");
            });
        });
        setItems(array => array.sort((item1, item2) => item1.id - item2.id))
    }, [itemIDs]) // Fetch item's details from backend

    return <div className="orders-main">
        <ConfigProvider theme={props.theme}>
            {
                itemIDs.length === 0 ? <>
                    <Button type="primary" href="/">Home</Button>
                    <div style={{ marginTop: "15px" }}>No orders. Go to homepage to search!</div>
                </> : items.map( (item, index) => <OrderCard
                    key={index}
                    itemId={item.id}
                    title={item.title}
                    tag={item.tag}
                    price={item.price}
                    imgUrl={item.image_urls && Object.keys(item.image_urls).length > 0 ? 
                        item.image_urls[Object.keys(item.image_urls)[0]] : ""}
                    removeOrder={removeOrder}
                    imgOnError={props.imgOnError}
                    remainTime={item.remainTime}
                />)
            }
        </ConfigProvider>
    </div>
}

function OrderCard(props) {
    const { itemId, title, tag, price, imgUrl, removeOrder, imgOnError, remainTime } = props
    const [canceling, setCanceling] = useState(false)
    const [checking, setChecking] = useState(false)
    const [deadline, setDeadline] = useState(1000)
    const [expired, setExpired] = useState(false)
    
    useEffect(() => {
        setDeadline(Date.now() + remainTime * 1000)
        if (remainTime < 0) {
            setExpired(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCancel = () => {
        setCanceling(true)
        const formData = new FormData();
        formData.append("item_id", itemId);
        const opt = {
            method: "POST",
            url: `${BASE_URL}/cancelorder`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            },
            data: formData
        };
        axios(opt).then((res) => {
            if (res.status === 200) {
                message.success("Order canceled!");
                setCanceling(false);
                removeOrder(itemId)
            }
        }).catch((err) => {
            console.log("Fail to cancel order: ", err.message);
            message.error("Failed to cancel order!");
            setCanceling(false);
        });
    }

    const handleCheckout = () => {
        setChecking(true)
        const formData = new FormData();
        formData.append("item_id", itemId);
        const opt = {
            method: "POST",
            url: `${BASE_URL}/checkout`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            },
            data: formData
        };
        axios(opt).then((res) => {
            if (res.status === 200) {
                message.success("Payment received!");
                setChecking(false);
                removeOrder(itemId)
            }
        }).catch((err) => {
            console.log("Fail to check out: ", err.message);
            message.error("Failed to check out!");
            setChecking(false);
        });
    }

    return <Card style={{marginTop: "20px"}}>
        <Row>
            <Col span={4}>
                <div className="order-card-title">{title}</div>
                { showTag(tag) }
                <div className="order-card-price">${price}</div>
                
            </Col>
            <Col span={4}>
                {
                    expired ? null : <>
                    <Button className="order-card-button" type="primary" onClick={handleCheckout}
                        loading={checking} disabled={canceling || checking}
                    >Check Out</Button>
                    <Button className="order-card-button" onClick={handleCancel}
                        loading={canceling} disabled={canceling || checking}
                    >Cancel</Button>
                </>
                }
            </Col>
            <Col span={4}>
                <div style={{marginLeft: "30px"}}>
                {
                    expired ? <div>
                        <div style={{marginBottom: "10px", fontSize: "large"}}>Expired</div>
                        <img src={expiredIcon} alt="" width="80px"/>
                    </div> :
                    <Statistic.Countdown 
                        title="Will expire in" 
                        value={deadline} 
                        onFinish={() => {setExpired(true)}}
                    />
                }
                </div>
            </Col>
            <Col span={12}>
                <img
                    className="order-card-image"
                    src={imgUrl}
                    alt=""
                    width="150px"
                    onError={imgOnError}
                    preview={false}
                />
            </Col>
        </Row>
    </Card>
}

export default Orders;