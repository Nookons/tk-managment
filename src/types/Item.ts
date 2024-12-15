

export interface IItem {
    box_number: string;
    timestamp: number;
    full_date: string;
    id: number;
    key: number;
    code: string;  // Make code optional
    name: string;
    user: string;
}

export interface IOption {
    code: string;
    id: number;
    name: string;
}