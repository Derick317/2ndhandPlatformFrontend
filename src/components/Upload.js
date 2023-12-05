import { useState, createRef } from "react";
import { useNavigate } from 'react-router-dom'
import {
    Form, Upload as AntUpload, Row, Col, Input, Button, Select, message,
    ConfigProvider, Modal
} from "antd";
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import axios from "axios";

import { BASE_URL, TOKEN_KEY, TAGS } from "../constants";

const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const uploadButton = (
    <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
    </div>
);

function Upload(props) {
    const { theme } = props
    const select_option = Object.keys(TAGS).map(item =>
        ({ 'value': TAGS[item], 'label': item }));
    const [imageList, setImageList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const formRef = createRef();

    const navigate = useNavigate();

    const handleChange = ({ file: newFile }) => {
        const isJpgOrPng = newFile.type === 'image/jpeg' || newFile.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = newFile.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        console.log("imageList.length");
        if (isLt2M && isJpgOrPng) {
            console.log("Add");
            setImageList([...imageList, newFile]);
        }
        console.log(imageList.length)
    };

    const beforeImageUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        console.log(imageList.length)
        return false || Upload.LIST_IGNORE;
    }

    const handlePreview = async (file) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
        setPreviewTitle(file.name);
    };

    const onUploadFinish = (values) => {
        setUploading(true);
        const formData = new FormData();
        delete values.images;
        for (const key in values) {
            if (values[key] !== undefined && values[key] !== null) {
                formData.append(key, values[key]);
            }
        }
        imageList.forEach(file => { formData.append('image', file); });
        const opt = {
            method: "POST",
            url: `${BASE_URL}/additem`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            },
            data: formData
        };

        axios(opt).then((res) => {
            if (res.status === 200) {
                message.success("The item is added!");
                setUploading(false);
                navigate("/list")
            }
        }).catch((err) => {
            console.log("Add item failed: ", err.message);
            message.error("Failed to add item!");
            setUploading(false);
        });
    }

    return <div className="upload-main">
        <ConfigProvider theme={theme}>
            <Form
                layout="vertical"
                requiredMark={false}
                onFinish={onUploadFinish}
                ref={formRef}
                disabled={uploading}>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            name="images"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            noStyle
                        >
                            <AntUpload
                                listType="picture-card"
                                // fileList={imageList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                disabled={uploading}
                                beforeUpload={() => false}
                            >
                                {imageList.length >= 1 ? null : uploadButton}
                            </AntUpload>
                        </Form.Item>
                    </Col>
                    <Col span={14} offset={2}>
                        <Form.Item
                            name={'title'}
                            label="Title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a tilte!"
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item
                                name="price"
                                label="Price"
                                rules={[{ required: true, message: "Please enter the price!" }]}
                                style={{ display: 'inline-block', width: 'calc(40% - 20px)' }}
                            >
                                <Input prefix="$" suffix="USD" placeholder="E.g. 3.14" />
                            </Form.Item>
                            <Form.Item
                                name="tag"
                                label="Tag"
                                rules={[{ required: true, message: "Please choose tag!" }]}
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(60% - 20px)',
                                    marginLeft: '40px'
                                }}
                            >
                                <Select options={select_option} />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item
                            name={'description'}
                            label="Description"
                            rules={[{ required: true, message: "Please add a description!" }]}
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item style={{ marginTop: "20px", float: "right" }}>
                    <Button style={{ marginRight: "20px" }} href="/list">
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={uploading} disabled={uploading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </ConfigProvider>
    </div>
}

export default Upload;