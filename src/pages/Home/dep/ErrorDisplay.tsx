import React, { useEffect, useState } from 'react';
import useErrorHistory from "../../../hooks/useErrorHistory";
import {Row, Tag} from "antd";

const ErrorDisplay = () => {
    const { errors, loading, error } = useErrorHistory();
    const [formated_data, setFormated_data] = useState<any[]>([]);

    useEffect(() => {
        const errorCountByStation = new Map();

        errors.forEach(el => {
            const { workStation } = el;

            if (!errorCountByStation.has(workStation)) {
                errorCountByStation.set(workStation, 0);
            }

            errorCountByStation.set(workStation, errorCountByStation.get(workStation) + 1);
        });

        const formattedArray = Array.from(errorCountByStation.entries()).map(([key, value]) => ({
            key,  // workStation
            value // count
        }));

        setFormated_data(formattedArray);
    }, [errors]);

    return (
        <Row gutter={[4, 4]}>
            {formated_data.map((error, index) => {

                return (
                    <Tag color={error.value > 1 ? "red" : "green"} key={index}>
                        <span>{error.key} - {error.value}</span>
                    </Tag>
                )
            })}
        </Row>
    );
};

export default ErrorDisplay;
