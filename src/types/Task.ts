import {IUser} from "./User";
import {IOption} from "./Item";

interface IDate {
    seconds: number;
    nanoseconds: number;
}

export interface ITaskRecord {
    id: string; // Report's unique identifier
    report_id: string | null;
    key: string;
    state: string;
    detection_date: IDate | null; // Can be either Date or dayjs object depending on usage
    detection_time: IDate | null;
    solved_date?: IDate | null;
    solved_time?: string | null;
    finder_array: IUser[] | null;
    repair_array: IUser[] | null;
    change_data: IOption[] | null;
    type: string;
    added_time: IDate;
    added_person: IUser;
    item_type: string | null;
    priority: string | null;
    processing_steps: string | null;
    remarks: string | null;
    sop: string | null;
    task_note: string | null;
    task_status: string | null;
}