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
    last_update: {
        seconds: number;
        nanoseconds: number;
    };
}


