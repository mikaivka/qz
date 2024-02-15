// quiz-api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizApiService {
  private apiUrl = 'https://pwcapi.nuovasoft.com'; // Replace this with your API endpoint
  private options: any;
  constructor(private http: HttpClient) {

    // const tkn = localStorage.getItem('pw:usr:tkn');
    // const accessToken = tkn ? JSON.parse(tkn) : null;

    this.options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('TimeZone-Offset',`${new Date().getTimezoneOffset()}`)
        .set('TimeZone-name',Intl.DateTimeFormat().resolvedOptions().timeZone)
        .set('api-version', '1')
        .set('Access-Control-Allow-Origin', '*')
        //.set('Authorization', `${'Bearer'}`+' ' +accessToken)
        // .set('mmc-hfid', this.current_facility_id)
        // .set('mmc-hfurl', this.current_furl)
    };
   }

  postQuizAnswers(answers: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/answers`, answers);
  }

  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/Auth/GetUser`, userData);
  }

  verifyOTP(userData: any): Observable<any> {
    //return this.http.post<any>(`${this.apiUrl}/api/Auth/VerifyOtp`, userData);
    return this.http
    .post(`${this.apiUrl}/api/Auth/VerifyOtp`, JSON.stringify(userData), this.options)
    .pipe(catchError(this.formatErrors));
  }

  register(userData: any): Observable<any> {
   // console.log(userData);
   // this.setDynamicHeader(accessToken);
    //return this.http.post<any>(`${this.apiUrl}/api/Auth/GetUser`, userData);
    return this.http
      .post(`${this.apiUrl}/api/Auth/GetUser`, JSON.stringify(userData), this.options)
      .pipe(catchError(this.formatErrors));
  }


  PostUserAnswerBulk(userData: any,accessToken:any): Observable<any> {
    debugger;
    this.setDynamicHeader(accessToken);
    //return this.http.post<any>(`${this.apiUrl}/api/Auth/VerifyOtp`, userData);
    return this.http
    .post(`${this.apiUrl}/api/Home/PostUserAnswerBulk`, JSON.stringify(userData), this.options)
    .pipe(catchError(this.formatErrors));
  }

  public GetQuestions(params: HttpParams = new HttpParams(),accessToken:any): Observable<any> {
    this.setDynamicHeader(accessToken);
    this.options.params = params;
    return this.http.get(`${this.apiUrl}/api/Home/GetQuestions`,
      this.options).pipe(

        catchError(this.formatErrors)
      );
  }


  public GetZone(params: HttpParams = new HttpParams()): Observable<any> {
    this.options.params = params;
    return this.http.get(`${this.apiUrl}/api/Home/GetZone`,
      this.options).pipe(

        catchError(this.formatErrors)
      );
  }

  public GetCity(params: HttpParams = new HttpParams()): Observable<any> {
    this.options.params = params;
    return this.http.get(`${this.apiUrl}/api/Home/GetCity`,
      this.options).pipe(

        catchError(this.formatErrors)
      );
  }


  public formatErrors(error: any): Observable<any> {

    console.log(error.error);


   return throwError(error);
 }

 setDynamicHeader(accessToken: string){
  this.options = {
    headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('TimeZone-Offset',`${new Date().getTimezoneOffset()}`)
      .set('TimeZone-name',Intl.DateTimeFormat().resolvedOptions().timeZone)
      .set('api-version', '1')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', `${'Bearer'}`+' ' +accessToken)
      // .set('mmc-hfid', this.current_facility_id)
      // .set('mmc-hfurl', this.current_furl)
  };
 }
}
