import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Icarta } from 'app/models/carta';
import { FirebaseId } from 'app/models/fb-key';
import { MyError } from 'app/models/my-error';


@Injectable({
    providedIn: 'root'
})

export class DataService {
  
    firebaseUrl: string = "https://bedou-ff0d2.firebaseio.com/"
    private _urlGameExample = 'assets/data/game_example.json';

    constructor(private http: HttpClient) {

    }

    getCardExample(): any {
        return this.http.get<any>(this._urlGameExample);
    }


    /************************ NEWS *************************************************/
    // getNews(): Observable<Inews[]>{
    //     return this.http.get<{ [key:string]: Inews}>(`${this.firebaseUrl}news.json`)
    //         .pipe(map(responseData => {
    //             const a_news: Inews[] = [];
    //             for (const key in responseData) {
    //                 if(responseData.hasOwnProperty(key)) {
    //                     a_news.push({...responseData[key], id:key});
    //                 }
    //             }
    //             return a_news;
    //         }),
    //         catchError(errorRes => {
    //             console.log('error: ', errorRes);
    //             throw new MyError(errorRes);
    //         })
    //     );
    // }

    // updateNew(to_save: Inews, field:string): Observable<any> {
    //     const key = `${to_save.id}/${field}`;
    //     const data = {};
    //     data[key] = to_save[field];
    //     console.log(data);
    //     return this.http.patch<FirebaseId>(`${this.firebaseUrl}news.json`, data);
    // }

    // postNew(to_save: Inews): Observable<FirebaseId> {
    //     return this.http.post<FirebaseId>(`${this.firebaseUrl}news.json`, to_save);
    // }

    // deleteNew(selNew: Inews): Observable<any> {
    //     return this.http.delete(`${this.firebaseUrl}news/${selNew.id}.json`, );
    // }
    /******************************************************************************* */

}