import React, {useEffect, useState} from 'react';
import {AutoComplete, Col, Drawer, Form, Input, message, Row, Space, Button, Result, InputProps} from "antd";
import {FileAddOutlined, SearchOutlined} from "@ant-design/icons";
import {arrayUnion, collection, doc, onSnapshot, query, setDoc} from 'firebase/firestore';
import {db} from "../../firebase";
import dayjs from "dayjs";
import Text from "antd/es/typography/Text";
import InputMask from "react-input-mask";
import {useAppSelector} from "../../hooks/storeHooks";

const MyHeader = () => {
    const [open, setOpen] = useState(false);
    const {user, error} = useAppSelector(state => state.user)

    const [value, setValue] = useState<string>('');
    const [box_number, setBox_number] = useState<string>('');
    const [data, setData] = useState<any[]>([]);

    const [optionsData, setOptionsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [currentPick, setCurrentPick] = useState<any>(null);

    const showDrawer = () => {
        setOpen(true);
        fetchOptions();
    };

    const fetchOptions = () => {
        setLoading(true);
        const q = query(collection(db, "item_library"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items: any[] = [];
            const data: any[] = [];
            querySnapshot.forEach((doc) => {
                items.push({value: doc.data().code});
                data.push(doc.data());
            });
            setOptionsData(items);
            setData(data);
            setLoading(false);
        });
        return () => unsubscribe();
    };

    useEffect(() => {
        const found = data.filter(item => item.code === value).pop()
        if (found) {
            setCurrentPick(found)
        } else {
            setCurrentPick(null)
        }
    }, [value]);


    const onClose = () => {
        setOpen(false);
    };

    const submitData = async () => {
        try {
            await setDoc(doc(db, "warehouse", Date.now().toString()), {
                ...currentPick,
                box_number: box_number.slice(0,7),
                timestamp: dayjs().valueOf(),
                full_date: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
                id: Date.now(),
                key: Date.now()
            });

            await setDoc(doc(db, "tote_info", box_number.slice(0, 7)), {
                item_inside: arrayUnion(currentPick), // Добавляет currentPick в массив item_inside
                timestamp: dayjs().valueOf(),
                update_time: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
                id: Date.now(),
            }, { merge: true });

            setValue("")
            onClose();
            message.success("Item successfully added");
        } catch (err) {
            message.error("Something went wrong");
        }
    };

    return (
        <div style={{display: 'flex', justifyContent: "flex-end", marginRight: 12}}>
            <Space direction="horizontal">
                {user &&
                    <div>
                        {user.email}
                    </div>
                }
                <Button onClick={showDrawer} type="default" shape="circle" icon={<FileAddOutlined/>}/>
                <Button type="default" shape="circle" icon={<SearchOutlined/>}/>
            </Space>

            <Drawer
                title="Add item window"
                width={"45%"}
                onClose={onClose}
                open={open}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Select"
                            rules={[{required: true, message: "Please select an option"}]}
                        >
                            <AutoComplete
                                style={{width: "100%"}}
                                options={optionsData}
                                value={value}
                                onChange={(value, option) => setValue(value)}
                                placeholder="Item uniq number"
                                filterOption={(inputValue, option) =>
                                    option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                {currentPick &&
                    <Row gutter={16}>
                        <Col span={18}>
                            <Text>
                                Hey there! Could you please take a moment to care of the box number and write it down below? This is just a placeholder for now,
                                until you have a special box for it or you decide to hold it in a special area.
                                It's totally fine if you missed this input — we're all human!
                            </Text>
                        </Col>

                        <Col span={6}>
                            <InputMask mask="99-9999" value={box_number} onChange={(e: any) => setBox_number(e.target.value)}>
                                {(inputProps: any) => <Input {...inputProps} />}
                            </InputMask>
                        </Col>

                        <Col span={24}>
                            <Result
                                status="success"
                                title={currentPick.name}
                                subTitle={`Code: ${currentPick.code} | Item ID: ${currentPick.id}`}
                                extra={[
                                    <Button onClick={submitData} type="primary" key="console">
                                        Add item
                                    </Button>,
                                    <Button onClick={() => setValue("")} key="buy">Clear</Button>,
                                ]}
                            />
                        </Col>
                    </Row>
                }
            </Drawer>
        </div>
    );
};

export default MyHeader;
