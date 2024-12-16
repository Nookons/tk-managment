import React, {useState} from 'react';
import dayjs, {Dayjs} from "dayjs";
import {Alert, Calendar, theme} from "antd";


const DayCalendar = () => {
    const { token } = theme.useToken();
    const [value, setValue] = useState(() => dayjs());
    const [selectedValue, setSelectedValue] = useState(() => dayjs());

    const wrapperStyle: React.CSSProperties = {
        width: 300,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };

    const onSelect = (newValue: Dayjs) => {
        setValue(newValue);
        setSelectedValue(newValue);
    };

    const onPanelChange = (newValue: Dayjs) => {
        setValue(newValue);
    };

    return (
        <div style={wrapperStyle}>
            <Alert message={`You selected date: ${selectedValue?.format('YYYY-MM-DD')}`} />
            <hr/>
            <Calendar
                value={value}
                onSelect={onSelect}
                onPanelChange={onPanelChange}
                fullscreen={false}
            />
        </div>
    );
};

export default DayCalendar;