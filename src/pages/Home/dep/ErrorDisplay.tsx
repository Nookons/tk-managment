import React, {useEffect, useState} from 'react';
import useErrorHistory from "../../../hooks/useErrorHistory";
import {Card, DatePicker, Form, Row, Space, Statistic, Switch, Tag, Tooltip} from "antd";
import Col from "antd/es/grid/col";
import dayjs, {Dayjs} from "dayjs";
import ErrorsChart from "./ErrorsChart";
import {IError} from "../../../types/Error";

// Типизация данных
interface FormattedError {
    Ws: string;
    count: number;
    stay_time: number;
}

const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.slice(10).split(':').map(Number);
    return hours * 60 + minutes;
};

const ErrorDisplay = () => {
    const [picked_date, setPicked_date] = useState<Dayjs>(dayjs());
    const {errors, loading, error} = useErrorHistory(picked_date);
    const [formated_data, setFormated_data] = useState<FormattedError[]>([]);

    const [isSeparetedSides, setIsSeparetedSides] = useState<boolean>(false);

    const processErrors = (errors: IError[]) => {
        const uniqueItems: { [key: string]: FormattedError } = {};

        errors.forEach(item => {
            const date = dayjs(item.startTime.slice(0, 10));

            if (date.isSame(picked_date, 'day')) { // Сравнение по дню
                let work_title = item.workStation.replace(/^0+/, '').slice(0, isSeparetedSides ? 4 : 2); // Убираем ведущие нули

                let startTimeInMinutes = 0;
                let endTimeInMinutes = 0;

                if (item.startTime && item.endTime) {
                    startTimeInMinutes = timeToMinutes(item.startTime);
                    endTimeInMinutes = timeToMinutes(item.endTime);
                }

                const diffInMinutes = endTimeInMinutes - startTimeInMinutes;
                const itemKey = work_title || "unknown";

                if (uniqueItems[itemKey]) {
                    uniqueItems[itemKey].count += 1;
                    uniqueItems[itemKey].stay_time += diffInMinutes;
                } else {
                    uniqueItems[itemKey] = {Ws: work_title, count: 1, stay_time: diffInMinutes};
                }
            }
        });

        return Object.values(uniqueItems);
    };

    // Эффект для обновления данных при изменении ошибок или выбранной даты
    useEffect(() => {
        if (errors) {
            const formattedData = processErrors(errors);
            setFormated_data(formattedData);
        }
    }, [errors, picked_date, isSeparetedSides]); // зависимости: ошибки и выбранная дата

    return (
        <Row gutter={[4, 4]}>
            {/* Date Picker */}
            <Col span={24}>
                <Space>
                    <Form.Item label="Select Date" name="datepicker">
                        <DatePicker
                            value={picked_date}
                            onChange={(date) => setPicked_date(date || dayjs())} // обработка null значений
                            defaultValue={dayjs()}
                        />
                    </Form.Item>
                    <Form.Item label="Separeted side" name="switch" valuePropName="checked">
                        <Switch onChange={() => setIsSeparetedSides(!isSeparetedSides)} value={isSeparetedSides} defaultChecked={false}/>
                    </Form.Item>
                </Space>

                <Statistic style={{position: "absolute", left: 74}} title="Total Errors in day" value={errors.length}/>
            </Col>

            {/* Выводим теги с данными ошибок */}
            {/*<Col span={24}>
                {formated_data.map((error) => {
                    const content = (
                        <>
                            <p>Errors count: {error.count}</p>
                            <p>Stay time: {error.stay_time} minutes</p>
                        </>
                    );

                    return (
                        <Tag color={error.stay_time > 6 ? "error" : "success"} key={error.Ws}>
                            <Tooltip title={content}>
                                <span>Workstation {error.Ws}</span>
                            </Tooltip>
                        </Tag>
                    );
                })}
            </Col>*/}

            {/* График ошибок */}
            <Col span={24}>
                <ErrorsChart formated_data={formated_data}/>
            </Col>
        </Row>
    );
};

export default ErrorDisplay;
