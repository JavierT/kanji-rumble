import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { Icarta } from 'app/models/carta';
import { FirebaseId } from 'app/models/fb-key';
import { MyError } from 'app/models/my-error';
import { Irecord } from 'app/models/records.model.';
import { Player } from 'app/models/player.model';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
    providedIn: 'root'
})

export class DataService {
  
    firebaseUrl: string = "https://kenji-83f0d.firebaseio.com/"
    private _urlGameExample = './assets/data/game_example.json';

    public lastRecord = new Subject<Irecord>();
    public oldRecord = new Subject<Irecord>();

    constructor(private http: HttpClient, private firestore: AngularFirestore) {

    }

    getCardExample(): any {
        return this.http.get<any>(this._urlGameExample);
    }

    //<Map<string, Icarta[]>
    getAllTiles(): Observable<Map<string, string[]>>{
        return this.http.get<object>(`${this.firebaseUrl}tiles.json`)
            .pipe(map(responseData => {
                let a_tiles = new Map();
                for (const key in responseData) {
                    if (responseData.hasOwnProperty(key)) {
                        const element = responseData[key];
                        a_tiles.set(key, element)
                    }
                }
                console.log(a_tiles)
                return a_tiles;

                 
            }),
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
        console.log('filter date ', beginningDateObject)
        return this.firestore.collection<Irecord>('records', 
        ref => ref.where('timestamp', '>', beginningDateObject).orderBy('timestamp', 'desc')//.orderBy('score', 'desc')
        .limit(10)).snapshotChanges()
    }

    /**
     * This is called to retrieve the last record of this player and save it 
     * @param userId 
     */
    getRecordByUserId(userId) {
        const snapshotResult = this.firestore.collection("records",  
            ref => ref.where('userId', '==', userId).limit(1))
            .snapshotChanges()
            .pipe(flatMap(records => records)); 
        snapshotResult.subscribe(doc => {
            this.lastRecord.next(<Irecord>doc.payload.doc.data());
            console.log("last known record", this.lastRecord)
        });
    }
    

    saveRecord(record: Irecord) {
        const snapshotResult = this.firestore.collection("records",  
            ref => ref.where('userId', '==', record.userId).limit(1))
            .snapshotChanges()
            .pipe(flatMap(records => records)); 
        snapshotResult.subscribe(doc => {
            const recordRef = doc.payload.doc.ref;
            const recordDB = <Irecord>doc.payload.doc.data()
            this.oldRecord.next(recordDB);
            console.log(this.oldRecord);
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

    getPlayers() {
        return this.firestore.collection('users').snapshotChanges()
    }

    /******************************************************************************* */

}