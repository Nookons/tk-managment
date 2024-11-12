import React, {useState} from 'react';
import {AutoComplete, Col, Form, Input, Result, Row, Skeleton} from "antd";
import useFetchOptions from "../../../hooks/useFetchOptions";
import ItemScreen from "./ItemScreen";

const AddItem = () => {
    const {options, loading, error} = useFetchOptions();
    const [current_pick, setCurrent_pick] = useState<string | null>(null);

    const [item_sum, setItem_sum] = useState<number>(1);

    if (loading) { return <Skeleton/> }
    if (error) {
        return (
            <Result
                status="500"
                title="500"
                subTitle="Oh no! Something went wrong when we loaded the options from the server."
            />
        )
    }

    return (
        <div>
            <Row gutter={16}>
                <Col span={20}>
                    <Form.Item label="Item select" rules={[{required: true, message: "Please select an option"}]}>
                        <AutoComplete
                            style={{width: "100%"}}
                            value={current_pick}
                            onChange={(value, option) => setCurrent_pick(value)}
                            options={options.map(item => ({value: item.code}))}
                            placeholder="Item unique number"
                            filterOption={(input, option) =>
                                (option as { value: string }).value.toUpperCase().includes(input.toUpperCase())
                            }
                        />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item label="" name="">
                        <Input
                            value={item_sum}
                            defaultValue={item_sum}
                            onChange={(e) => setItem_sum(Number(e.target.value))}
                            type={"number"}
                        />
                    </Form.Item>
                </Col>
                {current_pick && current_pick.length === 11 && (
                    <ItemScreen current_pick={current_pick} setCurrent_pick={setCurrent_pick} item_sum={item_sum}/>
                )}
            </Row>
        </div>
    );
};

export default AddItem;