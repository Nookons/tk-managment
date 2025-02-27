import React, {FC, useEffect, useState} from 'react';
import {Drawer, Row} from "antd";
import {IDrawerOptions} from "../MyHeader";
import ReportForm from "./ReportForm";
import Col from "antd/es/grid/col";

import RobotIco from '../../../assets/ico/Robot/robot_2_64dp.svg'
import BadgeIco from '../../../assets/ico/badge_64dp.svg'
import EvoStationIco from '../../../assets/ico/ev_station_64dp.svg'
import ShelfIco from '../../../assets/ico/shelves_64dp.svg'
import QRIco from '../../../assets/ico/qr_code_scanner_64dp.svg'

import styles from './Report.module.css'

interface ReportDrawerProps {
    drawer_options: IDrawerOptions;
    setDrawer_options: React.Dispatch<React.SetStateAction<IDrawerOptions>>;
}

const ReportDrawer: FC<ReportDrawerProps> = ({drawer_options, setDrawer_options}) => {
    const [reportType, setReportType] = useState<string>("");

    useEffect(() => {
        if (reportType.length) {
            setDrawer_options((prev) => ({...prev, report_child: true}));
        }
    }, [reportType]);

    return (
        <Drawer
            title="Type of report window"
            width={220}
            closable={false}
            onClose={() => setDrawer_options((prev) => ({...prev, report_drawer: false}))}
            open={drawer_options.report_drawer}
            destroyOnClose={false} // Форма не удаляется при закрытии
        >
            <Row style={{gap: 14}} gutter={[14, 14]}>
                <Col
                    onClick={() => setReportType("robot")}
                    className={styles.CardItem}
                    span={24}
                >
                    <img src={RobotIco} alt="Robot Icon"/>
                </Col>
                <Col
                    onClick={() => setReportType("workStation")}
                    className={styles.CardItem}
                    span={24}
                >
                    <img src={BadgeIco} alt="Robot Icon"/>
                </Col>
                <Col
                    onClick={() => setReportType("chargeStation")}
                    className={styles.CardItem}
                    span={24}
                >
                    <img src={EvoStationIco} alt="Robot Icon"/>
                </Col>
                <Col
                    onClick={() => setReportType("vsw")}
                    className={styles.CardItem}
                    span={24}
                >
                    <img src={ShelfIco} alt="Robot Icon"/>
                </Col>
                <Col
                    onClick={() => setReportType("qr")}
                    className={styles.CardItem}
                    span={24}
                >
                    <img src={QRIco} alt="Robot Icon"/>
                </Col>
            </Row>

            <Drawer
                title={reportType}
                width={520}
                closable={false}
                onClose={() => setDrawer_options((prev) => ({...prev, report_child: false}))}
                open={drawer_options.report_child}
                destroyOnClose={false} // Форма не удаляется при закрытии
            >
                <ReportForm reportType={reportType}/>
            </Drawer>
        </Drawer>
    );
};

export default ReportDrawer;