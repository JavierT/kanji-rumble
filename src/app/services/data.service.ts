import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { map, catchError, flatMap, take } from 'rxjs/operators';
import { MyError } from 'app/models/my-error';
import { Irecord, RecordPeriod, RecordPeriodHelper } from 'app/models/records.model.';
import { Player, PlayerUpdate } from 'app/models/player.model';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { GameInfo, GameLevel } from 'app/models/gameInfo';
import { Tools } from 'app/tools';


@Injectable({
    providedIn: 'root'
})

export class DataService {
  
    firebaseUrl: string = "https://kanjirumble-9d2fa.firebaseio.com/"
    private _urlGameExample = './assets/data/game_example.json';

    // TODO pass records to game service
    public lastRecord = new ReplaySubject<Irecord>();
    public lastRecordObs = this.lastRecord.asObservable();
    public oldRecord = new ReplaySubject<Irecord>();
    public oldRecordObs = this.oldRecord.asObservable();

    constructor(private http: HttpClient, private firestore: AngularFirestore) {

    }

    getCardExample(): any {
        return this.http.get<any>(this._urlGameExample);
    }

    //<Map<string, Icarta[]>
    getGameMainInfos(): Observable<GameInfo>{
        return this.http.get<any>(`${this.firebaseUrl}.json`)
            .pipe(map((responseData: any) => {
                let gameInfo: GameInfo = {
                    gameName: responseData.gameName,
                    levels: [],
                }
                for (const level of responseData.levels) {
                    const levelMap = new Map<string, string[]>();
                    for (const  folder of level.folders) {
                        levelMap.set(folder.name, folder.images);
                    }
                    let gameLevel: GameLevel = {
                        levelId: Number(level.levelId),
                        levelName: level.levelName,
                        folderName: level.folderName,
                        mapImagesByFolder: levelMap,
                        multiplier: Number(level.multiplier)
                    }
                    gameInfo.levels.push(gameLevel)
                }
                return gameInfo;
            }
            ),
            catchError(errorRes => {
                console.log('error: ', errorRes);
                throw new MyError(errorRes);
            })
        );
    }
    /************************ Records *************************************************/
    createRecord(record: Irecord){
        this.lastRecord.next(record);
        return this.firestore.collection('records').add(record);
    }

    getRecords(period: RecordPeriod, limit?: number) {
        return this.firestore.collection<Irecord>(RecordPeriodHelper.getDatabaseRecordsTable(period), 
        ref => ref.orderBy('score', 'desc')
        ).snapshotChanges()   //.limit(limit)
    }

    getRecordsFilterByDate(period: RecordPeriod, beginningDateObject: Date) {
        return this.firestore.collection<Irecord>(RecordPeriodHelper.getDatabaseRecordsTable(period), 
        ref => ref.where('timestamp', '>', beginningDateObject).orderBy('timestamp', 'desc')//.orderBy('score', 'desc')
        ).snapshotChanges() //.limit(10)
    }

    /**
     * This is called to retrieve the last record of this player and save it 
     * @param userId 
     */
    getRecordByUserId(userId) {
        const snapshotResult = this.firestore.collection<Irecord>("records",  
            ref => ref.where('userId', '==', userId).limit(1))
            .snapshotChanges();
            // .pipe(flatMap(records => records)); 
        snapshotResult.pipe(take(1)).subscribe(doc => {
            let arrayRec = []
            arrayRec = doc.map(e => {
                return  { id: e.payload.doc.id,
                    ...e.payload.doc.data() as Irecord };
                })
            if(arrayRec.length > 0) {
                this.lastRecord.next(arrayRec[0]);
                //console.log("last record of user recovered ", arrayRec[0])
            }
        });
    }

    public updateRecords(newPossibleRecord: Irecord) {
        this.lastRecord.next(newPossibleRecord);
        this.updateAllTimeBestRecord(newPossibleRecord);
        this.updateMonthlyRecord(newPossibleRecord);
        this.updatWeeklyRecord(newPossibleRecord);
    }
    
    /**
     * Recovers the record of the dabase and updates it if needed
     * @param record: Record just achieved
     */
    updateAllTimeBestRecord(newPossibleRecord: Irecord) {
        const snapshotResult = this.firestore.collection("records",  
            ref => ref.where('userId', '==', newPossibleRecord.userId).limit(1))
            .snapshotChanges()
            .pipe(flatMap((records) => records)); 
        snapshotResult.pipe(take(1)).subscribe(doc => {
            const recordRef = doc.payload.doc.ref;
            const recordDB = <Irecord>doc.payload.doc.data()
            this.oldRecord.next(recordDB);
            // We have the dabatase record
            if (this.isAllTimeBetterRecord(recordDB, newPossibleRecord)) {
                recordRef.update(newPossibleRecord);
            }
            
        });
    }

    private isAllTimeBetterRecord(oldR: Irecord, newPossibleRecord: Irecord) {
        if (oldR.score < newPossibleRecord.score) {
            return true;
        }
        return false;
    }

     /**
     * Recovers the record of the month the dabase and updates it if needed
     * @param record: Record just achieved
     */
    updateMonthlyRecord(newPossibleRecord: Irecord) {
        const docRef  =  this.firestore.collection("monthlyRecords").doc(newPossibleRecord.userId);
        docRef.get().pipe(take(1)).subscribe((thisDoc) => {
            if (thisDoc.exists) {
                const recordDB = <Irecord>thisDoc.data();
                if (this.isMonthlyBetterRecord(recordDB, newPossibleRecord)) {
                    thisDoc.ref.update(newPossibleRecord).then(
                        (res) => {console.log("updating record ")}
                    ).catch(
                        (res) => {console.log("ERROR updating record ", res)}
                    );
                }   
            } else {
                // Create
                thisDoc.ref.set(newPossibleRecord);
            }
        });
    }

    private isMonthlyBetterRecord(oldR: Irecord, newPossibleRecord: Irecord) {
        const dateToday = new Date();
        const dateOldRecord = oldR.timestamp.toDate();
        const isThisMonth = dateToday.getMonth() === dateOldRecord.getMonth();
        if (!isThisMonth) {
            return true
        }
        if (oldR.score < newPossibleRecord.score) {
            return true;
        }
        return false;
    }

    /**
     * Recovers the record of the month the dabase and updates it if needed
     * @param record: Record just achieved
     */
    updatWeeklyRecord(newPossibleRecord: Irecord) {
        const docRef  =  this.firestore.collection("weeklyRecords").doc(newPossibleRecord.userId);
        docRef.get().pipe(take(1)).subscribe((thisDoc) => {
            if (thisDoc.exists) {
                const recordDB = <Irecord>thisDoc.data();
                if (this.isWeeklyBetterRecord(recordDB, newPossibleRecord)) {
                    thisDoc.ref.update(newPossibleRecord).then(
                        (res) => {console.log("updating record ")}
                    ).catch(
                        (res) => {console.log("ERROR updating record ", res)}
                    );
                }   
            } else {
                // Create
                thisDoc.ref.set(newPossibleRecord);
            }
        });
    }

    private isWeeklyBetterRecord(oldR: Irecord, newPossibleRecord: Irecord) {
        const dateToday = new Date();
        const dateOldRecord = oldR.timestamp.toDate();
        const isThisWeek = Tools.getWeek(dateToday) === Tools.getWeek(dateOldRecord);
        if (!isThisWeek) {
            return true
        }
        if (oldR.score < newPossibleRecord.score) {
            return true;
        }
        return false;
    }
    

    public createEmptyRecord(userUid: string): Irecord {
        return {
            "userId": userUid,
            "score": 0,
            "level": 0,
            "percent": 0,
            "timestamp": new Date(),
            "total_time": 0,
            "mode": "",
        }
    }

    /************* Players ***************************************/
    getPlayers() {
        return this.firestore.collection('users').snapshotChanges()
    }

    getPlayer(uid: string) {
        return this.firestore.collection<Player>("users").doc(uid).get();
    }

    updatePlayer(playerId: string, playerUpdate: PlayerUpdate) {
        const update = new Subject<boolean>();
        const docRef  =  this.firestore.collection("users").doc(playerId);
        docRef.get().subscribe((thisDoc) => {
            if (thisDoc.exists) {
                docRef.update(playerUpdate)
                    .then(() => update.next(true)) 
                    .catch((error) => update.thrownError(new MyError("Error al actualizar los datos del jugador.")));
            } else {
                throw new MyError("No se ha podido guardar los datos")
            }
        });
        return update;
    }

    /******************************************************************************* */

    public getAvatar(avatar: string) {
        return  `./assets/img/avatars/${avatar}`;
    }
}