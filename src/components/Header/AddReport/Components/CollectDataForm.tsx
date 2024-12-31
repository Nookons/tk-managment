import React, { useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import { DatePicker, Form, Select, Space, Button, Input, Checkbox } from 'antd';
import { useAppSelector } from '../../../../hooks/storeHooks';

const { TextArea } = Input;

// Интерфейс для значений формы
interface FormValues {
    start_time: string;
    status: string;
    reason: string;
    change_parts: string[];
    description: string;
    checkbox: boolean;
}

const CollectDataForm = ({ unit_id, type }: { unit_id: string; type: string }) => {
    const [form] = useForm<FormValues>();  // Типизация формы
    const options = useAppSelector(state => state.options.options);

    const [isPartsToChange, setIsPartsToChange] = useState<boolean>(false);

    const statusOptions = [
        { value: 'completed', label: 'Completed' },
        { value: 'process', label: 'Process' },
        { value: 'founded', label: 'Founded' },
        { value: 'observation', label: 'Observation' },
    ];

    const reasonRobotOptions = [
        { value: 'Freeze', label: 'Freeze' },
        { value: 'Lidar', label: 'Lidar' },
        { value: 'Wheel', label: 'Wheel' },
    ];

    // Уникальное имя формы на основе unit_id или type
    const formName = `${unit_id}-${type}`;

    // Обработка успешной отправки формы
    const onFormFinish = (values: FormValues) => {
        console.log(values);
    };

    // Обработка ошибки отправки формы
    const onFormFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    // Обработка очистки формы
    const onFormClearClick = () => {
        form.resetFields();
    };

    return (
        <Form
            style={{ marginTop: 24 }}
            form={form}
            name={formName} // Уникальное имя для каждой формы
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 24 }}
            layout="horizontal"
            initialValues={{ remember: true }}
            onFinish={onFormFinish} // Важно для обработки успешного сабмита
            onFinishFailed={onFormFinishFailed} // Важно для обработки ошибок сабмита
        >
            <Form.Item label="Start Time" name="start_time">
                <DatePicker format="YYYY-MM-DD HH:mm" showTime />
            </Form.Item>

            <Form.Item label="Status" name="status">
                <Select style={{ minWidth: 155 }}>
                    {statusOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item label="Reason" name="reason">
                <Select style={{ minWidth: 155 }}>
                    {reasonRobotOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            {isPartsToChange && (
                <Form.Item label="Change Parts" name="change_parts">
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please pick parts to change"
                        options={options.map(el => ({ value: el.name, label: el.name }))}
                    />
                </Form.Item>
            )}

            <Form.Item label="Description" name="description">
                <TextArea rows={2} />
            </Form.Item>

            <Form.Item label="Parts to Change" name="checkbox" valuePropName="checked">
                <Checkbox
                    checked={isPartsToChange}
                    onChange={() => setIsPartsToChange(!isPartsToChange)}
                />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }} labelCol={{ span: 4 }}>
                <Space wrap>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button htmlType="button" onClick={onFormClearClick}>
                        Clear
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default CollectDataForm;
