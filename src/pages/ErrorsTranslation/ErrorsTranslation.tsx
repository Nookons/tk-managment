import React from 'react';


const ErrorsTranslation: React.FC = () => {


    return (
        <div>
            <h2>Журнал событий</h2>
            <table id="eventTable">
                <thead>
                <tr>
                    <th>Имя</th>
                    <th>Дата</th>
                    <th>Время начала</th>
                    <th>Рабочая станция</th>
                    <th>Режим</th>
                    <th>Описание</th>
                    <th>Решение</th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    );
}

export default ErrorsTranslation;
