import React from 'react';

const RobotAssets = () => {
    const essIp = 'http://10.251.3.25:9000/';
    const queryTypeUrl = essIp + 'ess-api/model/queryModelByType?modelType=robot';

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    fetch(queryTypeUrl, { method: 'GET', headers })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Fetch error:', error.message));


    return (
        <div>
            RobotAssets...
        </div>
    );
};

export default RobotAssets;