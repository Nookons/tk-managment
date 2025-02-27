import React, {useState} from 'react';
import {AutoComplete, Button, Col, Form, Input, Result, Row, Skeleton} from "antd";
import useFetchOptions from "../../../hooks/useFetchOptions";
import ItemScreen from "./ItemScreen";

const AddItem = () => {
    const {options, loading, error} = useFetchOptions();
    const [current_pick, setCurrent_pick] = useState<string | null>(null);


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
                <Col span={24}>
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
                {current_pick && current_pick.length === 11 && (
                    <ItemScreen current_pick={current_pick} setCurrent_pick={setCurrent_pick}/>
                )}
            </Row>
        </div>
    );
};

export default AddItem;