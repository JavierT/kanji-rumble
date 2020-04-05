import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { map, catchError, flatMap, take } from 'rxjs/operators';
import { Icarta } from 'app/models/carta';
import { FirebaseId } from 'app/models/fb-key';
import { MyError } from 'app/models/my-error';
import { Irecord } from 'app/models/records.model.';
import { Player } from 'app/models/player.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { GameInfo, GameLevel } from 'app/models/gameInfo';
import { getMatFormFieldPlaceholderConflictError } from '@angular/material';


@Injectable({
    providedIn: 'root'
})

export class DataService {
  
    firebaseUrl: string = "https://kanjirumble-9d2fa.firebaseio.com/"
    private _urlGameExample = './assets/data/game_example.json';

    // TODO pass records to game service
    public lastRecord = new Subject<Irecord>();
    public oldRecord = new Subject<Irecord>();

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
                        levelName: level.levelName,
                        folderName: level.folderName,
                        mapImagesByFolder: levelMap
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
    /************************ NEWS *************************************************/
    createRecord(record: Irecord){
        this.lastRecord.next(record);
        return this.firestore.collection('records').add(record);
    }

    getTenBestRecords() {
        return this.firestore.collection<Irecord>('records', 
        ref => ref.orderBy('timestamp', 'desc')
        .limit(10)).snapshotChanges()
    }

    getTenLastRecordsFilterByDate(beginningDateObject: Date) {
        return this.firestore.collection<Irecord>('records', 
        ref => ref.where('timestamp', '>', beginningDateObject).orderBy('timestamp', 'desc')//.orderBy('score', 'desc')
        .limit(10)).snapshotChanges()
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
            }
        });
    }
    

    saveRecord(record: Irecord) {
        const snapshotResult = this.firestore.collection("records",  
            ref => ref.where('userId', '==', record.userId).limit(1))
            .snapshotChanges()
            .pipe(flatMap(records => records)); 
        snapshotResult.pipe(take(1)).subscribe(doc => {
            const recordRef = doc.payload.doc.ref;
            const recordDB = <Irecord>doc.payload.doc.data()
            this.oldRecord.next(recordDB);
            if (this.isBetterRecord(recordDB, record)) {
                recordRef.update(record);
            }
            this.lastRecord.next(record);
        });
    }

    private isBetterRecord(oldR: Irecord, newR: Irecord) {
        if (oldR.score !== newR.score) {
            return newR.score > oldR.score;
        } else {
            return newR.total_time < oldR.total_time;
        }
    }

    public createEmptyRecord(userUid: string): Irecord {
        return {
            "userId": userUid,
            "score": 0,
            "level": 0,
            "percent": 0,
            "timestamp": new Date(),
            "total_time": 0
        }
    }

    getPlayers() {
        return this.firestore.collection('users').snapshotChanges()
    }

    updatePlayer(player: Player, difficulty: number, mode: number) {
        const docRef  =  this.firestore.collection("users").doc(player.id);
        const playerUpdate = {
            "difficulty": difficulty,
            "mode": mode
        }
        docRef.get().subscribe((thisDoc) => {
            if (thisDoc.exists) {
                docRef.update(playerUpdate);
            } else {
                throw new MyError("No se ha podido guardar los datos")
            }
        });
    }

    /******************************************************************************* */

}