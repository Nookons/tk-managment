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

    const onChildClose = () => {
        setDrawer_options((prev) => ({...prev, report_child: false}))
        setReportType("")
    }

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
                    <h4 style={{marginLeft: 4}}>Robot</h4>
                    <img src={RobotIco} alt="Robot Icon"/>
                </Col>
                <Col
                    onClick={() => setReportType("workStation")}
                    className={styles.CardItem}
                    span={24}
                >
                    <h4 style={{marginLeft: 4}}>Work Station</h4>
                    <img src={BadgeIco} alt="WorkStation Icon"/>
                </Col>
                <Col
                    onClick={() => setReportType("chargeStation")}
                    className={styles.CardItem}
                    style={{backgroundColor: "rgba(255,0,0,0.5)"}}
                    span={24}
                >
                    <h4 style={{marginLeft: 4}}>Charge Station</h4>
                    <img src={EvoStationIco} alt="Charge Icon"/>
                </Col>
                <Col
                    onClick={() => setReportType("vsw")}
                    className={styles.CardItem}
                    style={{backgroundColor: "rgba(255,0,0,0.5)"}}
                    span={24}
                >
                    <h4 style={{marginLeft: 4}}>VSW Station</h4>
                    <img src={ShelfIco} alt="VSW Icon"/>
                </Col>
                <Col
                    onClick={() => setReportType("qr")}
                    className={styles.CardItem}
                    style={{backgroundColor: "rgba(255,0,0,0.5)"}}
                    span={24}
                >
                    <h4 style={{marginLeft: 4}}>QR Code</h4>
                    <img src={QRIco} alt="QR Icon"/>
                </Col>
            </Row>

            <Drawer
                title={reportType}
                width={520}
                closable={false}
                onClose={onChildClose}
                open={drawer_options.report_child}
                destroyOnClose={false} // Форма не удаляется при закрытии
            >
                <ReportForm reportType={reportType}/>
            </Drawer>
        </Drawer>
    );
};

export default ReportDrawer;