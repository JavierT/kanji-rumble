import { FirebaseId } from './fb-key';

export enum RecordPeriod {
    ALL,
    MONTHLY,
    WEEKLY
}

export class RecordPeriodHelper {
    public static getDatabaseRecordsTable(enumValue: RecordPeriod) {
        let field = "records";
        switch (enumValue) {
            case RecordPeriod.WEEKLY:
                field = 'weeklyRecords';
                break;
            case RecordPeriod.MONTHLY:
                field = 'monthlyRecords';
                break;
            default:
                break;
        }
        return field;
    }
}

export interface Irecord extends FirebaseId {
    userId: string,
    username?: string,
    score: number,
    level : number,
    percent: number,
    timestamp: any,
    total_time : number,
    mode: string,
}
