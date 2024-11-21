import React, { useState } from 'react';
import { useForm } from "antd/es/form/Form";
import { Button, Drawer, Form, Input, message, Space } from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import Text from "antd/es/typography/Text";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAppDispatch } from "../../hooks/storeHooks";
import { userEnter } from "../../store/reducers/user";
import logo from "../../assets/logo.jpg";
import './SignIn.css';

// Define the structure of employer data
interface EmployerData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const dispatch = useAppDispatch();
    const [form] = useForm();
    const [childrenDrawer, setChildrenDrawer] = useState(false);
    const [loading, setLoading] = useState(false);

    const showChildrenDrawer = () => setChildrenDrawer(true);
    const onChildrenDrawerClose = () => setChildrenDrawer(false);

    const onFormFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const q = query(collection(db, "employers"), where("email", "==", values.email));
            const querySnapshot = await getDocs(q);
            let result: any | null = null;

            querySnapshot.forEach((doc) => {
                result = doc.data() as EmployerData; // Explicitly assert the type here
            });

            if (!result) {
                message.error("This user does not exist in the system");
            } else if (result.password !== values.password) {
                message.error("Your password is incorrect");
            } else {
                dispatch(userEnter(result));
                message.success("Logged in successfully");
            }
        } catch (err) {
            err && message.error(err.toString());
        } finally {
            setLoading(false);
        }
    };

    const onFormFinishFailed = (errorInfo: any) => {
        message.error("Please check the fields and try again.");
    };

    const onFormClearClick = () => form.resetFields();

    return (
        <div className="background">
            <Drawer title="Login page" width={"40%"} closable={false} open={true}>
                <Form
                    form={form}
                    name="loginForm"
                    layout="horizontal"
                    initialValues={{ remember: true }}
                    onFinish={onFormFinish}
                    onFinishFailed={onFormFinishFailed}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please enter your email" }]}
                    >
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please enter your password" }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Login
                            </Button>
                            <Button type="link" onClick={onFormClearClick}>
                                Clear
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
                <Drawer
                    title="New employer rules"
                    width={"40%"}
                    closable={false}
                    onClose={onChildrenDrawerClose}
                    open={childrenDrawer}
                >
                    <Text>
                        {/* Welcome message content */}
                    </Text>
                </Drawer>
            </Drawer>
        </div>
    );
};

export default SignIn;
