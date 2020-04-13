export interface Icarta {
    "folder": string,
    "img" : string,
    "type"?: string,
    "selected"?: boolean,
    "solution"?: boolean,
}

export enum StatusCard {
    HIDE = 0,
    PLAY = 1,
    SOLVE = 2,
    FINISH = 3
}
