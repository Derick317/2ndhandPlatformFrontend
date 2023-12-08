import {
    BookOutlined
} from '@ant-design/icons';
import { Tag } from 'antd';

import { TAGS } from "../constants"

export const showTag = (tagId) => {
    if (tagId === TAGS.Books) {
        return <Tag icon={ <BookOutlined /> } color="#55acee">
            Book
        </Tag>
    }
    if (tagId === TAGS.Electronics) {
        return <Tag color="orange">
            Electronics
        </Tag>
    }
    if (tagId === TAGS.Stationery) {
        return <Tag color="green">
            Stationery
        </Tag>
    }
}