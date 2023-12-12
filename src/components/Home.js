import { Card, Row, Col, message } from "antd";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

import { BASE_URL, ROOT_PATH, TAGS } from "../constants";
import { showTag } from "./Tag";

const cardWidthPx = 300
const mainMarginPx = 50
const cardSpacePx = 50

export const SearchResult = (props) => {
    const [ homeItemIDs, setHomeItemIDs ] = useState([]);
    const searchParams = useSearchParams()[0];
    useEffect(() => {
        const keywords = searchParams.get("keywords");
        const opt = {
            method: "GET",
            url: !keywords ? `${BASE_URL}/search?tag=${searchParams.get("tag")}` : 
            `${BASE_URL}/search?tag=${searchParams.get("tag")}&keywords=${keywords}`,
        };
        axios(opt).then((res) => {
            if (res.status === 200) {
                const { data } = res;
                setHomeItemIDs(data === null ? [] : data)
            }
        }).catch((err) => {
            console.log("query item failed: ", err.message);
            message.error("Failed to get item details!");
        });
    }, [searchParams]);

    return <HomeBase itemIDs={homeItemIDs} {...props}/>
}

export const Home = (props) => {
    const [ homeItemIDs, setHomeItemIDs ] = useState([]);
    useEffect(() => {
        const opt = {
            method: "GET",
            url: `${BASE_URL}/search?tag=${TAGS.All}`,
        };
        axios(opt).then((res) => {
            if (res.status === 200) {
                const { data } = res;
                setHomeItemIDs(data === null ? [] : data)
            }
        }).catch((err) => {
            console.log("query item failed: ", err.message);
            message.error("Failed to get item details!");
        });
    }, []);

    return <HomeBase itemIDs={homeItemIDs} {...props}/>
}

function calColsInRow(scrollWidth) {
    return Math.floor((scrollWidth - mainMarginPx * 2) / (cardWidthPx + cardSpacePx))
}

function HomeBase(props) {
    const { itemIDs, scrollWidth, imgOnError } = props;
    const [items, setItems] = useState([]);
    const [colsInRow, setColsInRow] = useState(calColsInRow(scrollWidth));

    useEffect(() => {
        setItems(arg => []);
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
    }, [itemIDs]); // Fetch item's details from backend

    useEffect(() => { setColsInRow(calColsInRow(scrollWidth)); }, [scrollWidth]);

    return <div
        className="home-main" 
        style={{marginLeft: `${mainMarginPx}px`, marginRight: `${mainMarginPx}px`}}
    >
    {
        [...new Array(Math.ceil(items.length / colsInRow)).keys()].map((rIdx) => <Row 
            key={rIdx}
            style={{marginBottom: "20px"}}
        >
        {
            [...new Array(colsInRow).keys()].map((cIdx) => {
                const idx = rIdx * colsInRow + cIdx;
                console.log(items[idx])
                return <Col flex={1} key={cIdx}>
                {
                    idx >= items.length ? 
                    <div style={{ width: `${cardWidthPx}px`, margin: "auto" }}/> :
                    <HomeCard
                        itemId={items[idx].id}
                        title={items[idx].title}
                        tag={items[idx].tag}
                        price={items[idx].price}
                        imgUrl={items[idx].image_urls && Object.keys(items[idx].image_urls).length > 0 ? 
                        items[idx].image_urls[Object.keys(items[idx].image_urls)[0]] : ""}
                        imgOnError={imgOnError}
                    />
                }
                </Col>;
            })
        }
        </Row>)
    }
    </div>
}

function HomeCard(props) {
    const { itemId, title, tag, price, imgUrl, imgOnError } = props;
    return <Card
        title={<Link
            style={{fontSize: "large", color: "black"}} 
            to={`${ROOT_PATH}/item/${itemId}`}
            target="_blank"
            // rel="noreferrer"
            >
                {title}
            </Link>}
        bordered={false}
        style={{ width: `${cardWidthPx}px`, margin: "auto" }}
        bodyStyle={{padding: 0, paddingBottom: "16px"}}
    >
        <Link
        style={{color: "black"}} 
        to={`${ROOT_PATH}/item/${itemId}`}
        target="_blank"
        // rel="noreferrer"
        >
            <img
                src={imgUrl} 
                width={`${cardWidthPx}px`}
                height={`${3 * cardWidthPx / 4}px`}
                onError={imgOnError}
                preview={false}
                style={{paddingBottom: "10px"}}
                alt=""
            />
            <span style={{fontWeight: "bold", paddingLeft: "16px"}}>
                ${price}
                <span style={{float: "right", paddingRight: "16px"}}>{showTag(tag)}</span>
            </span>
        </Link>
    </Card>
}