import { FirebaseId } from './fb-key';

export interface Irecord extends FirebaseId {
    "userId": string,
    "username"?: string,
    "score": number,
    "level" : number,
    "percent": number,
    "timestamp": Date,
    "total_time" : number
}
