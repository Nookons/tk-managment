import {IItem} from "./Item";

export interface ITote {
    id: number;
    item_inside: IItem[];
    timestamp: number;
    tote_number: string;
    update_time: string;
    updated_by: string;
}