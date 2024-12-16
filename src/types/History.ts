import {IUser} from "./User";
import {IItem} from "./Item";

export interface IAction {
    action_time: string;
    color: string;
    id: number;
    type: string;
    item: IItem;
    tote_number: string;
    updated_by: IUser;
}

export interface IHistory {
    tote_id: string;
    updated_at: string;
    updated_by: IUser;
    actions: IAction[]
}