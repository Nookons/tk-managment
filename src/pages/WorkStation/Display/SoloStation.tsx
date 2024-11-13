import React, {useEffect, useState} from 'react';
import {Card, Descriptions, List, Spin, Table} from "antd";

const SoloStation = () => {

    const [stations_Data, setStations_Data] = useState<any[]>([]);


    if (!stations_Data) {
        return <Spin />;
    }

    return (
        <div>
        </div>
    );
};

export default SoloStation;
