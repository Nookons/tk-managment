import React, { FC, useEffect, useState } from 'react';
import Col from "antd/es/grid/col";
import { DatePicker, Form, Input, Row, Select, TimePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs, { Dayjs } from 'dayjs';
import Button from "antd/es/button";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../../../firebase";

interface FirstStepProps {
    next: () => void;
    main_id: string;
}

interface LocalData {
    equipment_type: string;
    item_id: string;
    state: string;
    detection_date: Dayjs | null;
    detection_time: Dayjs | null;
    task: string;
    id: string;
}

const FirstStep:FC <FirstStepProps> = ({next, main_id}) => {  // Destructuring props correctly
    const format = 'HH:mm';

    const [local_data, setLocal_data] = useState<LocalData>({
        equipment_type: "robot",
        item_id: "",
        state: "",
        detection_date: null,
        detection_time: null,
        task: "",
        id: main_id
    });

    const onNextClick = async () => {
        await setDoc(doc(db, "tasks_record", main_id), {
            ...local_data,
            detection_date: dayjs(local_data.detection_date).format("YYYY-MM-DD"),
            detection_time: dayjs(local_data.detection_time).format("HH:mm"),
        });
        next();
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof LocalData) => {
        const { value } = e.target;
        setLocal_data(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleSelectChange = (value: string, field: keyof LocalData) => {
        setLocal_data(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };

    return (
        <Form layout="vertical">
            <Row gutter={[16, 16]}>
                <Col span={4}>
                    <Form.Item required label="Equipment type">
                        <Select
                            value={local_data.equipment_type}
                            onChange={(value) => handleSelectChange(value, 'equipment_type')}
                        >
                            <Select.Option value="robot">Robot</Select.Option>
                            <Select.Option value="workstation">Work Station</Select.Option>
                            <Select.Option value="charge">Charge Station</Select.Option>
                            <Select.Option value="compressor">Air Compressor</Select.Option>
                            <Select.Option value="vsw">VSW</Select.Option>
                            <Select.Option value="qr">QR Code</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Form.Item required label="ID" name="id">
                        <Input
                            value={local_data.item_id}
                            onChange={(e) => handleInputChange(e, 'item_id')}
                        />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item required label="State">
                        <Select
                            value={local_data.state}
                            onChange={(value) => handleSelectChange(value, 'state')}
                        >
                            <Select.Option value="disable">Disable Removal</Select.Option>
                            <Select.Option value="return">Return to use</Select.Option>
                            <Select.Option value="running">Running and awaiting maintenance</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Form.Item required label="Date of Issue Detection" name="detection_date">
                        <DatePicker
                            value={local_data.detection_date}
                            onChange={(date) => setLocal_data(prevState => ({...prevState, detection_date: date}))}
                        />
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Form.Item required label="Time of Issue Detection" name="detection_time">
                        <TimePicker
                            format={format}
                            value={local_data.detection_time}
                            onChange={(time) => setLocal_data(prevState => ({...prevState, detection_time: time}))}
                        />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="Task & Issue" name="task">
                        <TextArea
                            rows={4}
                            value={local_data.task}
                            onChange={(e) => handleInputChange(e, 'task')}
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Button type="primary" onClick={onNextClick}>
                        Next
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default FirstStep;
