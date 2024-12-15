import React, {FC, useEffect, useState} from 'react';
import {Col, Form, Input, message, Result, Row, Skeleton} from "antd";
import {useAppSelector} from "../../../hooks/storeHooks";
import {IOption} from "../../../types/Item";
import Button from "antd/es/button";
import {addItem} from "../../../utils/Item/AddItem";
import dayjs from "dayjs";

interface ItemScreenProps {
    current_pick: string;
    setCurrent_pick: (value: string) => void;
}

const ItemScreen:FC <ItemScreenProps> = ({current_pick, setCurrent_pick}) => {
    const {options, loading} = useAppSelector(state => state.options)
    const {user} = useAppSelector(state => state.user)

    const [picked_item, setPicked_item] = useState<IOption | null>(null);
    const [tote_number, setTote_number] = useState<string>("");

    const [item_sum, setItem_sum] = useState<number>(1);

    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    useEffect(() => {
        if (options && current_pick) {
            const found = options.filter(item => item.code === current_pick).pop();
            setPicked_item(found)
        }
    }, []);

    const submitData = async () => {
        setIsButtonLoading(true);

        if (tote_number.length <= 0) {
            message.error("Item not added, please write a tote number before adding tote to system")
            setIsButtonLoading(false);
            return;
        }
        if (item_sum <= 0) {
            message.error("Item not added, sum of items can't be less then or 0")
            setIsButtonLoading(false);
            return;
        }

        for (let i = 0; i < item_sum; i++) {
            const item = {
                ...picked_item,
                user: user ? user.email : "Unknown",
                box_number: tote_number,
                name: options.filter(item => item.name === picked_item?.name).pop().name,
                code: options.filter(item => item.code === picked_item?.code).pop().code,
                timestamp: dayjs().valueOf(),
                full_date: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
                id: Date.now(),
                key: Date.now()
            }

            try {
                await addItem({item});
            } catch (err) {
                err && message.error(err.toString())
            }
        }

        message.success("Items was added")
        setTote_number("")
        setItem_sum(1)
        setCurrent_pick("")
        setIsButtonLoading(false);
    }

    if (loading) { return <Skeleton/>}

    return (
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item label="Box number" name="box_number">
                    <Input value={tote_number} onChange={(e: any) => setTote_number(e.target.value.toUpperCase())}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Items count" name="items_count">
                    <Input
                        value={item_sum}
                        defaultValue={item_sum}
                        onChange={(e) => setItem_sum(Number(e.target.value))}
                        type={"number"}
                    />
                </Form.Item>
            </Col>
            <Col span={24}>
                <Result
                    status="success"
                    title={picked_item?.name}
                    subTitle={`Item ID: ${picked_item?.id} | Uniq Number: ${picked_item?.code}`}
                    extra={[
                        <Button loading={isButtonLoading} onClick={submitData} type="primary" key="console">
                            Add item
                        </Button>,
                        <Button onClick={() => setCurrent_pick("")} key="buy">Clear</Button>,
                    ]}
                />
            </Col>
        </Row>
    );
};

export default ItemScreen;