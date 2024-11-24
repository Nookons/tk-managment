import React, {FC, useState} from 'react';
import {Form, message, Row, Select, Space} from "antd";
import TextArea from "antd/es/input/TextArea";
import SelectItems from "../../../../pages/Robots/AddBroken/dep/SelectItems";
import Col from "antd/es/grid/col";
import Button from "antd/es/button";

interface ThirdStepProps {
    next: () => void;
    prev: () => void;
    main_id: string;
}

const ThirdStep:FC <ThirdStepProps> = ({next, prev, main_id}) => {
    const [change_data, setChange_data] = useState<any[]>([]);

    return (
        <Row gutter={[16, 16]}>
            <Col span={2}>
                <Form.Item required layout={"vertical"} label="SOP" name={"sop"}>
                    <Select>
                        <Select.Option value="yes">Yes</Select.Option>
                        <Select.Option value="no">No</Select.Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col span={8}>
                <Form.Item required layout={"vertical"} label="Types of repair approaches" name={"item_type"}>
                    <Select>
                        <Select.Option value="replace">Replace with new spare part</Select.Option>
                        <Select.Option value="manual">Manual repair</Select.Option>
                        <Select.Option value="software">Software update</Select.Option>
                        <Select.Option value="observation">Maintain observation</Select.Option>
                        <Select.Option value="swapping">Swapping accessories</Select.Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col span={14}>
                <Form.Item layout={"vertical"} label="Material name" name={"materials"}>
                    <SelectItems setChange_data={setChange_data}/>
                </Form.Item>
            </Col>

            <Col span={24}>
                <Form.Item layout={"vertical"} label="Processing Steps" name="processing_steps">
                    <TextArea rows={4}/>
                </Form.Item>
            </Col>

            <Col span={24}>
                <Col span={24}>
                    <Space>
                        <Button type="primary" onClick={() => message.loading("in progress")}>
                            Done
                        </Button>
                        <Button type="default" onClick={() => prev()}>
                            Prev
                        </Button>
                    </Space>
                </Col>
            </Col>
        </Row>
    );
};

export default ThirdStep;