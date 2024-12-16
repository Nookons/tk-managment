import {IItem} from "./Item";
import {IUser} from "./User";

export interface ITote {
    id: number;
    item_inside: IItem[];
    timestamp: number;
    user: IUser;
    tote_number: string;
    update_time: string;
    updated_by: string;
}