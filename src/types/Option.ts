import {IUser} from "./User";


export interface IOption {
    name: string;
    code: string;
    id: number;
    part_type?: string;
    imageUrl?: string;
    timestamp?: number;
    update_time?: string;
    person_update?: IUser;
    description?: string;
}