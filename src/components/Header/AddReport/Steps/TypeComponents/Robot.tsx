import React, {useEffect, useState} from 'react';
import robots_data from '../../../../../utils/Robots.json';
import {
    AutoComplete,
    DatePicker,
    Form,
    Row,
    TimePicker,
    Tooltip,
    Button,
    message,
    Select,
    notification, Divider
} from "antd";
import dayjs, {Dayjs, OptionType} from "dayjs";
import Col from "antd/es/grid/col";
import Checkbox from "antd/es/checkbox/Checkbox";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../../../../firebase";
import {useAppSelector} from "../../../../../hooks/storeHooks";
import RobotDescription from "./RobotDep/RobotDescription";
import RobotButtonsGroup from "./RobotDep/RobotButtonsGroup";
import TextArea from "antd/es/input/TextArea";

const Robot = () => {
    const format = 'HH:mm';
    const user = useAppSelector(state => state.user.user);
    const [current_data, setCurrent_data] = useState<any | null>(null);

    const {options, loading, error} = useAppSelector(state => state.options)

    const [pick_datetime, setPick_datetime] = useState<Dayjs>(dayjs()); // Для даты и времени

    const showNotificationSuccess = (task_id: string) => {
        notification.success({
            message: <span>Task for that robot was added</span>,
            description: <span>Hi there, robot {data.robot_id} was success added, task id: {task_id}</span>,
            placement: 'topRight',
        });
    };

    const [data, setData] = useState({
        isDescription: false,
        isParts_to_chage: false,
        change_parts: [""],
        description: "",
        robot_id: "",
        status: "founded"
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (data.robot_id.length === 7) {
            const found = robots_data.find(robot => robot.id.toString() === data.robot_id);
            setCurrent_data(found || null); // Обработка случая, если данных нет
        }
    }, [data]);


    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            setPick_datetime(prev => prev.set('date', date.date()).set('month', date.month()).set('year', date.year()));
        }
    };

    const handleTimeChange = (time: Dayjs | null) => {
        if (time) {
            setPick_datetime(prev => prev.set('hour', time.hour()).set('minute', time.minute()));
        }
    };

    const onSubmit = async () => {
        try {
            if (data.robot_id.length !== 7) {
                message.error("Invalid robot id");
                return null
            }

            setIsLoading(true)
            const id = dayjs().valueOf().toString()

            const prepared_data = {
                ...data,
                task_id: id,
                type: "robot",
                added_person: user,
                start_time: dayjs(pick_datetime).format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
                start_timestamp: dayjs(pick_datetime).valueOf(),
                start_time_chine: dayjs(pick_datetime).add(7, "hour").format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
                start_timestamp_chine: dayjs(pick_datetime).add(7, "hour").valueOf(),
            }

            await setDoc(doc(db, "task_list", id), {
                ...prepared_data
            });

            showNotificationSuccess(id)

            setData({
                isDescription: false,
                isParts_to_chage: false,
                description: "",
                change_parts: [""],
                robot_id: "",
                status: "founded"
            })

            setCurrent_data(null)

        } catch (err) {
            err && message.error(err.toString());
        }
        finally {
            setIsLoading(false)
        }
    }

    const onChangeParts = (value: string[]) => {
        setData((prev) => ({...prev, change_parts: value}));
    };

    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} xl={data.robot_id.length === 7 ? 8 : 24}>
                <Row style={{backgroundColor: "#f3f3f3", padding: 14, borderRadius: 4}} gutter={[16, 16]}>
                    <Col span={8}>
                        <Form.Item layout={"vertical"} label="Robot ID">
                            <AutoComplete
                                disabled={isLoading}
                                value={data.robot_id}
                                onChange={(e) => setData((prev) => ({...prev, robot_id: e }))}
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
                    <Col span={16}>
                        <Form.Item layout={"vertical"} label="Current status">
                            <Select
                                defaultValue={data.status}
                                onChange={(e) => setData((prev) => ({...prev, status: e }))}
                                disabled={isLoading}
                            >
                                <Select.Option value="founded">Founded</Select.Option>
                                <Select.Option value="process">In process</Select.Option>
                                <Select.Option value="completed">Completed</Select.Option>
                                <Select.Option value="observation">Observation</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Button loading={isLoading} onClick={onSubmit} style={{width: "100%", marginTop: 29}} type="primary">Submit</Button>
                    </Col>
                    <Col span={24}>
                        <Checkbox
                            disabled={isLoading}
                            checked={data.isDescription}
                            onChange={() => setData((prev) => ({...prev, isDescription: !prev.isDescription}))}
                        >
                            Description
                        </Checkbox>
                        <Checkbox
                            disabled={isLoading}
                            checked={data.isParts_to_chage}
                            onChange={() => setData((prev) => ({...prev, isParts_to_chage: !prev.isParts_to_chage}))}
                        >
                            Parts to change
                        </Checkbox>
                    </Col>
                    <Col span={24}>
                        {data.isParts_to_chage &&
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
                            <Form.Item label="Description" name="textarea">
                                <TextArea
                                    onChange={(e) => setData((prev) => ({...prev, description: e.target.value }))}
                                    rows={2}
                                />
                            </Form.Item>
                        }
                    </Col>
                </Row>
            </Col>
            <Col xs={24} xl={16}>
                {data.robot_id.length === 7 &&
                    <RobotButtonsGroup pick_datetime={pick_datetime} current_data={current_data} />
                }
                <Divider dashed/>
                {data.robot_id.length === 7  && (
                    <RobotDescription current_data={current_data} />
                )}
            </Col>
        </Row>
    );
};

export default Robot;
