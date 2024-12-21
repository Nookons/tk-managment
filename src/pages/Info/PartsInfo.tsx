import React from 'react';
import {useAppSelector} from "../../hooks/storeHooks";
import {Card, Descriptions, Image, Row, Select} from "antd";
import SoloPart from "./SoloPart";
import Text from "antd/es/typography/Text";

const PartsInfo = () => {
    const {options, loading, error} = useAppSelector(state => state.options)


    if (loading) return <div>Loading...</div>

    if(error) return <div>Error</div>

    return (
        <Row gutter={[16, 16]}>
            {options.map(option => {

                return (
                    <SoloPart option={option} />
                )
            })}
        </Row>
    );
};

export default PartsInfo;