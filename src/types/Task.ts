import {IUser} from "./User";
import {IOption} from "./Item";

export interface ITaskRecord {
    id: string; // Report's unique identifier
    report_id: string | null;
    detection_date: Date | null; // Can be either Date or dayjs object depending on usage
    detection_time: Date | null;
    solved_date?: Date | null;
    solved_time?: Date | null;
    finder_array: IUser[] | null;
    repair_array: IUser[] | null;
    change_data: IOption[] | null;
    added_time: Date;
    added_person: IUser;
    item_type: string | null;
    priority: string | null;
    processing_steps: string | null;
    remarks: string | null;
    sop: string | null;
    task_note: string | null;
    task_status: string | null;
}