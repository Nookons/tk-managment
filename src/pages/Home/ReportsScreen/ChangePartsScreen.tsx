import React from 'react';
import { IReportChangePart } from "../../../types/Reports/Report";
import { Alert, Tree } from "antd";

const ChangePartsScreen = ({ parts }: { parts: IReportChangePart[] }) => {

    if (parts.length === 0) {
        return <Alert message={<span>Nothing was replaced at this time</span>} type="info" />;
    }

    const treeData = parts.map((part, index) => ({
        title: part,
        key: `part-${index}`,
        isLeaf: true,
    }));

    return (
        <div>
            <Tree showLine treeData={treeData} />
        </div>
    );
};

export default ChangePartsScreen;
