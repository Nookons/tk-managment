import React from 'react';

const FullScreen = () => {
    fetch("http://10.46.137.231:9001/", {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa('username:password'),
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });





    return (
        <div>
            
        </div>
    );
};

export default FullScreen;