import React, {useEffect, useState} from 'react';
import useErrorHistory from "../../../../hooks/useErrorHistory";
import {DatePicker, Empty, Form, Row, Skeleton, Space, Statistic, Switch, Tag, Tooltip} from "antd";
import Col from "antd/es/grid/col";
import dayjs, {Dayjs} from "dayjs";
import ErrorsChart from "./ErrorsChart";
import isBetween from 'dayjs/plugin/isBetween';
import {AimOutlined, AlertOutlined, ExclamationCircleOutlined, YoutubeOutlined} from "@ant-design/icons";
import Button from "antd/es/button";
import {REPORT_REFACTOR} from "../../../../utils/const";
import { useNavigate } from 'react-router-dom';
import {processErrors} from "./ErrorUtils";

dayjs.extend(isBetween);

export interface FormattedError {
    Ws: string;
    count: number;
    stay_time: number;
}


const ErrorDisplay = () => {
    const navigate = useNavigate();
    const [picked_date, setPicked_date] = useState<Dayjs>(dayjs());
    const {errors, loading, error} = useErrorHistory(picked_date);
    const [formated_data, setFormated_data] = useState<FormattedError[]>([]);

    const [isSeparetedSides, setIsSeparetedSides] = useState<boolean>(
        localStorage.getItem("homeSide") === "true"  // converts string to boolean
    );

    const [isDayShift, setIsDayShift] = useState<boolean>(
        localStorage.getItem("homeShift") === "true"  // converts string to boolean
    );

    const [errorsInShiftCount, setErrorsInShiftCount] = useState<number>(0); // состояние для подсчета ошибок в смене

    const onSidesHandle = () => {
        setIsSeparetedSides(!isSeparetedSides);
        localStorage.setItem("homeSide", isSeparetedSides ? "false" : "true");
    }

    const onDayHandle = () => {
        setIsDayShift(!isDayShift);
        localStorage.setItem("homeShift", isDayShift ? "false" : "true");
    }


    // Эффект для обновления данных при изменении ошибок или выбранной даты
    useEffect(() => {
        if (errors) {
            const formattedData = processErrors(errors, isDayShift, isSeparetedSides, picked_date, setErrorsInShiftCount);
            setFormated_data(formattedData);
        }
    }, [errors, picked_date, isSeparetedSides, isDayShift]); // зависимости: ошибки и выбранная дата

    if (loading) {
        return <Skeleton />
    }

    return (
        <Row gutter={[4, 4]}>
            <Col span={24}>
                <Space style={{alignItems: "center", justifyContent: "center"}}>
                    <Form.Item label="Select Date" name="datepicker">
                        <DatePicker
                            value={picked_date}
                            onChange={(date) => setPicked_date(date || dayjs())} // обработка null значений
                            defaultValue={dayjs()}
                        />
                    </Form.Item>

                    <Form.Item label="Separeted side" name="switch" valuePropName="checked">
                        <Switch onChange={onSidesHandle} value={isSeparetedSides} defaultChecked={false}/>
                    </Form.Item>

                    <Form.Item label="Night / Day" name="switch" valuePropName="checked">
                        <Switch onChange={onDayHandle} value={isDayShift} defaultChecked={false}/>
                    </Form.Item>
                </Space>
                <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14, marginBottom: 24}}>
                    <Tooltip arrowPointAtCenter
                             title={<span>Attention, all errors data saving on database during one week, after that time it's automaticly removed</span>}>
                        <ExclamationCircleOutlined style={{fontSize: 18}}/>
                    </Tooltip>

                    <Tag icon={<AimOutlined  style={{fontSize: 16}} />} style={{color: "#ffffff"}} color="#333">
                        <span style={{fontSize: 16}}>{errors.length}</span>
                    </Tag>
                    <Tag icon={<AlertOutlined style={{fontSize: 16}} />} style={{color: "#ffffff"}} color="#333">
                        <span style={{fontSize: 16}}>{errorsInShiftCount}</span>
                    </Tag>
                </div>
            </Col>

            <Col span={24}>
                {errorsInShiftCount > 1
                    ? <ErrorsChart formated_data={formated_data}/>
                    : <Empty style={{marginTop: 14}}><Button onClick={() => navigate(REPORT_REFACTOR)} type="primary">Add
                        new error</Button></Empty>
                }
            </Col>
        </Row>
    );
};

export default ErrorDisplay;
