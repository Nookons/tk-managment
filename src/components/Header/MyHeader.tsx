import React, { useEffect, useState } from 'react';
import { AutoComplete, Col, Drawer, Form, Input, message, Row, Space, Button } from "antd";
import { FileAddOutlined, SearchOutlined } from "@ant-design/icons";
import { collection, doc, onSnapshot, query, setDoc } from 'firebase/firestore';
import { db } from "../../firebase";
import dayjs from "dayjs";
import InputMask from "react-input-mask";
import ItemDescription from "./dep/ItemDescription";

const MyHeader = () => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm(); // Initialize form instance
    const [value, setValue] = useState<string>('');
    const [optionsData, setOptionsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const showDrawer = () => {
        setOpen(true);
        fetchOptions();
    };

    const fetchOptions = () => {
        setLoading(true);
        const q = query(collection(db, "item_library"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items: any[] = [];
            querySnapshot.forEach((doc) => {
                items.push({ value: doc.data().code });
            });
            setOptionsData(items);
            setLoading(false);
        });

        // Unsubscribe from listener when component unmounts
        return () => unsubscribe();
    };

    const onClose = () => {
        setOpen(false);
    };

    const submitData = async (values: any) => {
        try {
            await setDoc(doc(db, "warehouse", Date.now().toString()), {
                ...values,
                item_code: value,
                timestamp: dayjs().valueOf(),
                full_date: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
                id: Date.now()
            });
            form.resetFields();
            onClose();
            message.success("Item successfully added");
        } catch (err) {
            console.error(err);
            message.error("Something went wrong");
        }
    };

    const onFinish = (values: any) => {
        submitData(values);
    };

    return (
        <div style={{ display: 'flex', justifyContent: "flex-end", marginRight: 12 }}>
            <Space direction="horizontal">
                <Button onClick={showDrawer} type="default" shape="circle" icon={<FileAddOutlined />} />
                <Button type="default" shape="circle" icon={<SearchOutlined />} />
            </Space>

            <Drawer
                title="Add item window"
                width={"45%"}
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={() => form.submit()} type="primary">Submit</Button>
                    </Space>
                }
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                    hideRequiredMark
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Select"
                                rules={[{ required: true, message: "Please select an option" }]}
                            >
                                <AutoComplete
                                    style={{ width: "100%" }}
                                    options={optionsData}
                                    value={value}
                                    onChange={(value, option) => setValue(value)}
                                    placeholder="try to type `b`"
                                    filterOption={(inputValue, option) =>
                                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            {value && <ItemDescription value={value}/>}
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </div>
    );
};

export default MyHeader;
