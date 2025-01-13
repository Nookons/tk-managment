import React, {useEffect, useState} from 'react';
import useErrorHistory from "../../../hooks/useErrorHistory";
import {Alert, DatePicker, Form, Row, Space, Statistic, Switch, Tooltip} from "antd";
import Col from "antd/es/grid/col";
import dayjs, {Dayjs} from "dayjs";
import ErrorsChart from "./ErrorsChart";
import {IError} from "../../../types/Error";
import isBetween from 'dayjs/plugin/isBetween';
import Button from "antd/es/button";
import {ExclamationCircleOutlined, ExclamationOutlined} from "@ant-design/icons";

dayjs.extend(isBetween);

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
    const [isDayShift, setIsDayShift] = useState<boolean>(false);
    const [errorsInShiftCount, setErrorsInShiftCount] = useState<number>(0); // состояние для подсчета ошибок в смене

    // Вспомогательная функция для формирования work_title
    const getWorkTitle = (workStation: string): string => {
        const removeZero = workStation.replace(/^0+/, ''); // Убираем ведущие нули
        return removeZero.length > 3 ? removeZero.slice(0, isSeparetedSides ? 4 : 2) : removeZero.slice(0, isSeparetedSides ? 4 : 1);
    };

    // Вспомогательная функция для вычисления разницы во времени
    const getTimeDifferenceInMinutes = (startTime: string, endTime: string): number => {
        const startTimeInMinutes = timeToMinutes(startTime);
        const endTimeInMinutes = timeToMinutes(endTime);
        return endTimeInMinutes - startTimeInMinutes;
    };

    // Вспомогательная функция для обработки данных
    const processItem = (item: IError, shift: string, uniqueItems: { [key: string]: FormattedError }) => {
        let workTitle = getWorkTitle(item.workStation);
        let diffInMinutes = 0;

        if (item.startTime && item.endTime) {
            diffInMinutes = getTimeDifferenceInMinutes(item.startTime, item.endTime);
        }

        const itemKey = workTitle || "unknown";

        if (uniqueItems[itemKey]) {
            uniqueItems[itemKey].count += 1;
            uniqueItems[itemKey].stay_time += diffInMinutes;
        } else {
            uniqueItems[itemKey] = {Ws: workTitle, count: 1, stay_time: diffInMinutes};
        }
    };

    // Функция обработки ошибок
    const processErrors = (errors: IError[]) => {
        const uniqueItems: { [key: string]: FormattedError } = {};
        let shiftErrorsCount = 0;

        errors.forEach(item => {
            const date = dayjs(item.startTime, "YYYY-MM-DD HH:mm");

            if (date.isSame(picked_date, 'day')) {
                const dayStart = dayjs(date).hour(6).minute(0).second(0); // 06:00
                const dayEnd = dayjs(date).hour(18).minute(0).second(0);  // 18:00
                const isDayShiftLocal = date.isBetween(dayStart, dayEnd, null, '[)');

                // Если isDayShift равен true и смена дневная
                if (isDayShift === true && isDayShiftLocal === true) {
                    shiftErrorsCount += 1;
                    console.log(item)
                    processItem(item, 'day', uniqueItems);
                }
                // Если isDayShift равен false и смена ночная
                else if (isDayShift === false && isDayShiftLocal === false) {
                    shiftErrorsCount += 1;
                    console.log(item)
                    processItem(item, 'night', uniqueItems);
                }
            }
        });

        setErrorsInShiftCount(shiftErrorsCount);
        return Object.values(uniqueItems);
    };

    // Эффект для обновления данных при изменении ошибок или выбранной даты
    useEffect(() => {
        if (errors) {
            const formattedData = processErrors(errors);
            setFormated_data(formattedData);
        }
    }, [errors, picked_date, isSeparetedSides, isDayShift]); // зависимости: ошибки и выбранная дата

    return (
        <Row gutter={[4, 4]}>
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
                        <Switch onChange={() => setIsSeparetedSides(!isSeparetedSides)} value={isSeparetedSides}
                                defaultChecked={false}/>
                    </Form.Item>
                    <Form.Item label="Night / Day" name="switch" valuePropName="checked">
                        <Switch onChange={() => setIsDayShift(!isDayShift)} value={isDayShift} defaultChecked={false}/>
                    </Form.Item>
                    <Statistic style={{margin: "0 14px"}} title="Total Errors in day" value={errors.length}/>
                    <Statistic style={{margin: "0 14px"}} title="Total Errors in shift"
                               value={errorsInShiftCount.toString()}/>
                    <Tooltip arrowPointAtCenter
                             title={<span>Attention, all errors data saving on database during one week, after that time it's automaticly removed</span>}>
                        <ExclamationCircleOutlined style={{fontSize: 24}} />
                    </Tooltip>
                </Space>
            </Col>

            {/* График ошибок */}
            <Col span={24}>
                <ErrorsChart formated_data={formated_data}/>
            </Col>
        </Row>
    );
};

export default ErrorDisplay;
