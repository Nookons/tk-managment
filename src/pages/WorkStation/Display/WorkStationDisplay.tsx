import React, { useEffect, useState } from 'react';
import SoloStation from "./SoloStation";
import { IDataItem } from "../../../types/WorkStation";
import { IApiResponse } from "../../../types/WorkStation";
import { Row } from "antd";
import Col from "antd/es/grid/col";

async function fetchAllSites(): Promise<IApiResponse> {
    const url = 'http://10.46.143.3/apollo/ws/api/station/tools/listAllSite';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add other headers if necessary
            },
        });

        // Check response success
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: IApiResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Get error when fetch:', error);
        throw error; // Re-throw error for handling in calling code
    }
}

const WorkStationDisplay = () => {
    const [workstation_data, setWorkstation_data] = useState<IDataItem[]>([]);

    // Function to fetch data
    const fetchData = () => {
        fetchAllSites()
            .then(data => {
                const result: IDataItem[] = [];
                data.data.forEach(station => {
                    if (station.taskType !== null) {
                        result.push(station);
                    }
                });
                setWorkstation_data(result);
            })
            .catch(error => {
                console.error('Cant fetch workstation list:', error);
            });
    };

    // Initial data fetch and set up interval
    useEffect(() => {
        fetchData(); // Initial fetch

        const intervalId = setInterval(() => {
            fetchData(); // Fetch data every second
        }, 1000);

        // Cleanup function to clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        console.log(workstation_data);
    }, [workstation_data]);

    return (
        <Row gutter={[16, 16]}>
            {workstation_data.map((station, i) => (
                <Col span={12} key={i}>
                    <SoloStation workstation_data={station} />
                </Col>
            ))}
        </Row>
    );
};

export default WorkStationDisplay;
