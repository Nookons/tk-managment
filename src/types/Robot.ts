import {IOption} from "./Item";

export interface IFileUpload {
    uid: string;
    status: 'done' | 'pending' | 'failed';
    name: string;
    type: string;
    size: number;
    lastModified: number;
    lastModifiedDate: string;
    response: any;
    percent: number;
    originFileObj: { uid: string };
    xhr: { uid: string };
}

export interface IRobotError {
    error_id: number;
    crash_time: number;
    chines_time: number;
    note: string;
    user: string;
    isRemove: boolean;
    isLog: boolean;
    change_items: IOption[];
    robot_number: string;
    files_array: string[];
    upload: {
        file: IFileUpload;
        fileList: IFileUpload[];
    };
}

export interface IBrokenRobots {
    error_array: IRobotError[];
    robot_number: string;
    last_update: {
        seconds: number;
        nanoseconds: number;
    };
}

export type IRobot = {
    locationCellCode: string | null;
    robotPathMode: string;
    waitPoint: string;
    batteryTemperature: string;
    errorType: string[];
    errorCode: string[];
    powerPercent: string;
    endCellCode: string | null;
    taskType: string | null;
    taskState: string | null;
    taskShelfCode: string | null;
    dist2WaitPoint: number;
    taskPhase: string | null;
    id: number;
    errorSolution: string[];
    batteryDischargeCurrent: string;
    stationId: string | null;
    product: string;
    batteryVoltage: string;
    ip: string;
    chargerId: string | null;
    errorCreateTime: string[];
    version: string;
    onLoadShelfCode: string | null;
    errorLevel: string[];
    exeStatus: string | null;
    endPoint: string | null;
    errorCategory: string[];
    robotStatus: string;
    instruction: string | null;
    robotType: string;
    location: string;
    taskId: string | null;
    robotSeries: string;
};



