import { Button, Form, Input, message, Modal, ConfigProvider } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import React from "react";
import axios from "axios";

import { BASE_URL, APP_NAME } from "../constants";

function LoginModal(props) {
    const [login, setLogin] = React.useState(true); // sign in or sign up
    const [passwordMatch, setPasswordMatch] = React.useState(true)

    const onLoginFinish = (values) => {
        const { email, password } = values;
        const opt = {
            method: "POST",
            url: `${BASE_URL}/signin`,
            data: {
                email: email,
                password: password
            },
            headers: { "Content-Type": 'application/json' }
        };
        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    const { data } = res;
                    props.handleLoggedIn(data.token, data.username, data.id);
                    message.success("Login succeed! ");
                    props.setOpen(false)
                }
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    message.error("Incorrect username or password!");
                } else {
                    message.error("Sign in failed!");
                }
            });
    };

    const onSignupFinish = (values) => {
        const { username, email, password, reEnterPassword } = values;
        if (reEnterPassword !== password) {
            setPasswordMatch(false);
            return;
        }
        const opt = {
            method: "POST",
            url: `${BASE_URL}/signup`,
            data: {
                username: username,
                email: email,
                password: password
            },
            headers: { "Content-Type": 'application/json' }
        };
        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    message.success("Sign up succeed!");
                    setLogin(true)
                }
            })
            .catch((err) => {
                if (err.response.status === 400 && "status" in err.response.data) {
                    message.error(err.response.data.status);
                } else {
                    message.error("Sign up failed!");
                }
            });
    };

    const loginForm = (
        <Form name="normal_login"
            className="login-form"
            onFinish={onLoginFinish}
            layout="vertical"
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[{
                    required: true,
                    message: "Please input your email!"
                }]}
            >
                <Input
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    placeholder="example@example.com"
                />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{
                    required: true,
                    message: "Please input your password!"
                }]}
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="password"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Sign in
                </Button>
                &ensp;or&ensp;
                <span className="login-link" onClick={() => setLogin(false)}>sign up now</span>
            </Form.Item>
        </Form>
    )

    const signupForm = (
        <Form name="normal_login"
            className="login-form"
            onFinish={onSignupFinish}
            layout="vertical"
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[{
                    required: true,
                    message: "Please input your email!"
                }]}
            >
                <Input
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    placeholder="example@example.com"
                />
            </Form.Item>
            <Form.Item
                label="Your name"
                name="username"
                rules={[{
                    required: true,
                    message: "Please input your username!"
                }]}
            >
                <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="username"
                />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{
                    required: true,
                    message: "Please input your password!"
                }]}
                validateStatus={passwordMatch ? "success" : "error"}
            >
                <Input.Password
                    onChange={() => setPasswordMatch(true)}
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="password"
                />
            </Form.Item>
            <Form.Item
                label="Please re-enter your password"
                name="reEnterPassword"
                validateStatus={passwordMatch ? "success" : "error"}
                help={passwordMatch ? null : "Passwords must match!"}
            >
                <Input.Password
                    onChange={() => setPasswordMatch(true)}
                    prefix={<LockOutlined className="site-form-item-icon" />}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Sign up
                </Button>
                &ensp;Already have an account?&ensp;
                <span className="login-link" onClick={() => setLogin(true)}>Sign in</span>
            </Form.Item>
        </Form>
    )
    return (
        <Modal
            title={login ? `Sign in to ${APP_NAME}` : "Sign up"}
            destroyOnClose={true}
            open={props.open}
            footer={null}
            onCancel={() => {
                setLogin(true)
                setPasswordMatch(true)
                props.setOpen(false)
            }}
        >
            <ConfigProvider theme={props.theme}>
                {login ? loginForm : signupForm}
            </ConfigProvider>
        </Modal>
    )
}

export default LoginModal;