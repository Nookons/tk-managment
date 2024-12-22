import React from 'react';
import {AutoComplete, Form, Button, Row, DatePicker, TimePicker, Select,} from 'antd';
import dayjs, {Dayjs} from 'dayjs';
import Col from "antd/es/grid/col";
import Checkbox from "antd/es/checkbox/Checkbox";
import TextArea from "antd/es/input/TextArea";

interface RobotFormProps {
    data: any;
    setData: React.Dispatch<React.SetStateAction<any>>;
    pick_datetime: Dayjs;
    setPick_datetime: React.Dispatch<React.SetStateAction<Dayjs>>;
    isLoading: boolean;
    options: any[];
    onSubmit: () => void;
    robots_data: any[];
}

const RobotForm: React.FC<RobotFormProps> = ({data, setData, pick_datetime, setPick_datetime, isLoading, options, onSubmit, robots_data}) => {
    const format = "HH:mm"

    const handleDateChange = (date: Dayjs | null) => {
        if (date) setPick_datetime(prev => prev.set('date', date.date()).set('month', date.month()).set('year', date.year()));
    };

    const handleTimeChange = (time: Dayjs | null) => {
        if (time) setPick_datetime(prev => prev.set('hour', time.hour()).set('minute', time.minute()));
    };

    const onChangeParts = (value: string[]) => {
        setData((prev: any) => ({...prev, change_parts: value}));
    };

    return (
        <Form layout="vertical">
            <Row style={{backgroundColor: "#f6f6f6", padding: 14, borderRadius: 4}} gutter={[4, 16]}>
                <Col span={8}>
                    <Form.Item layout={"vertical"} label="Robot ID">
                        <AutoComplete
                            disabled={isLoading}
                            value={data.unit_id}
                            onChange={(e) => setData((prev: any) => ({...prev, unit_id: e }))}
                            options={robots_data.map(robot => ({
                                value: robot.id.toString(),
                                label: robot.id.toString()
                            }))}
                            placeholder="1332248"
                            filterOption={(inputValue, option) =>
                                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item layout={"vertical"} label="Date" name="date">
                        <DatePicker
                            disabled={isLoading}
                            style={{width: "100%"}}
                            placeholder={dayjs(pick_datetime).format("YYYY-MM-DD")}
                            onChange={handleDateChange}
                            value={dayjs(pick_datetime)}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item layout={"vertical"} label="Time" name="time">
                        <TimePicker
                            disabled={isLoading}
                            style={{width: "100%"}}
                            placeholder={dayjs(pick_datetime).format("HH:mm")}
                            onChange={handleTimeChange}
                            value={pick_datetime}
                            format={format}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item layout={"vertical"} label="Current status">
                        <Select
                            defaultValue={data.status}
                            onChange={(e) => setData((prev: any) => ({...prev, status: e }))}
                            disabled={isLoading}
                        >
                            <Select.Option value="founded">Founded</Select.Option>
                            <Select.Option value="process">In process</Select.Option>
                            <Select.Option value="completed">Completed</Select.Option>
                            <Select.Option value="observation">Observation</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item layout={"vertical"} label="Reason">
                        <Select
                            defaultValue={data.reason}
                            onChange={(e) => setData((prev: any) => ({...prev, reason: e }))}
                            disabled={isLoading}
                        >
                            <Select.Option value="Obstacle">Obstacle problem</Select.Option>
                            <Select.Option value="Wheel">Wheel problem</Select.Option>
                            <Select.Option value="Freeze">Just freeze</Select.Option>
                            <Select.Option value="Collision">Collision</Select.Option>
                            <Select.Option value="Other">Other</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Button loading={isLoading} onClick={onSubmit} style={{width: "100%", marginTop: 29}} type="primary">Submit</Button>
                </Col>
                <Col span={24}>
                    <Checkbox
                        disabled={isLoading}
                        checked={data.isDescription}
                        onChange={() => setData((prev: any) => ({...prev, isDescription: !prev.isDescription}))}
                    >
                        Description
                    </Checkbox>
                    <Checkbox
                        disabled={isLoading}
                        checked={data.isParts_to_change}
                        onChange={() => setData((prev: any) => ({...prev, isParts_to_change: !prev.isParts_to_change}))}
                    >
                        Parts to change
                    </Checkbox>
                </Col>
                <Col span={24}>
                    {data.isParts_to_change &&
                        <Select
                            mode="multiple" // Режим мульти-выбора
                            style={{ width: '100%', margin: "14px 0" }} // Ширина компонента
                            placeholder="Please select" // Текст в качестве подсказки
                            onChange={onChangeParts} // Обработчик изменений
                            defaultValue={[]} // Начальное значение (пустой массив)
                            options={options.map((option) => ({
                                value: option.name, // Значение, которое будет отправляться
                                label: option.name, // Текст, который будет отображаться
                            }))}
                        />
                    }
                    {data.isDescription &&
                        <Form.Item layout={"horizontal"} label="Description" name="textarea">
                            <TextArea
                                onChange={(e) => setData((prev: any) => ({...prev, description: e.target.value }))}
                                rows={2}
                            />
                        </Form.Item>
                    }
                </Col>
            </Row>
        </Form>
    );
};

export default RobotForm;
