import React, {useState} from 'react';
import {useForm} from "antd/es/form/Form";
import {Button, Drawer, Form, Input, message, Space} from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import Text from "antd/es/typography/Text";
import {db} from "../../firebase";
import {collection, getDocs, query, where} from "firebase/firestore";
import {useAppDispatch} from "../../hooks/storeHooks";
import {userEnter} from "../../store/reducers/user";
import dayjs from "dayjs";

const SignIn = () => {
    const dispatch = useAppDispatch();
    const [form] = useForm();

    const [childrenDrawer, setChildrenDrawer] = useState(false);

    const showChildrenDrawer = () => {
        setChildrenDrawer(true);
    };

    const onChildrenDrawerClose = () => {
        setChildrenDrawer(false);
    };

    const onFormFinish = async (values: any) => {
        try {
            const q = query(collection(db, "employers"), where("email", "==", values.email));
            const querySnapshot = await getDocs(q);
            let result: any = null;
            querySnapshot.forEach((doc) => {
                result = doc.data();
            });
            if (!result) {
                message.error("This user does not exist in the system");
            } else if (result.password !== values.password) {
                message.error("You password is wrong");
            } else {
                dispatch(userEnter(result))
            }
        } catch (err) {
            err && message.error(err.toString());
        }
    };

    const onFormFinishFailed = (errorInfo: any) => {
        // todo handle form finish fail
    };

    const onFormClearClick = () => {
        form.resetFields();
    };

    return (
        <Drawer title="Login page" width={"40%"} closable={false}  open={true}>

            <Form
                form={form}
                name="basic"
                labelCol={{span: 0.5}}
                wrapperCol={{span: 24}}
                layout="horizontal"
                initialValues={{remember: true}}
                onFinish={onFormFinish}
                onFinishFailed={onFormFinishFailed}
            >
                <Form.Item required={true} label="Email" name="email">
                    <Input type={"email"}/>
                </Form.Item>
                <Form.Item required={true} label="Password" name="password">
                    <Input type={"password"}/>
                </Form.Item>
                <Form.Item label="" name="checkbox" valuePropName="checked">
                    <Checkbox>Stay in system</Checkbox>
                </Form.Item>
                <Form.Item wrapperCol={{offset: 0.5, span: 24}}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Login
                        </Button>
                        <Button type="default" onClick={showChildrenDrawer}>
                            I'm a new employer
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
                    Good afternoon, dear colleagues! I hope you're having a lovely day.
                    I just wanted to say a big, warm welcome to our company! I'm so happy you're here.
                    We're so happy to have you join our team! We're excited for the productive and interesting work we know we'll do together.
                    I'd love to tell you a little bit about our values and what's important to us as a team.
                    We really want to create a working atmosphere where everyone can show their best qualities, grow, and develop professionally.
                    We really appreciate it when people are open, when they're ready to work as a team, and when they're eager to learn and grow.
                    I want you to feel right at home here. Please don't hesitate to ask questions or seek support whenever you need it. We truly believe that the success of the company depends on the success of each and every employee.
                    We are so committed to doing everything we can to help you perform at your absolute best!
                    I also want to emphasize that your contribution to our work is very important,
                    and we appreciate the fresh perspective and ideas you can bring to our projects.
                    I hope that with your energy and knowledge we can achieve great success.
                </Text>
            </Drawer>
        </Drawer>
    );
};

export default SignIn;