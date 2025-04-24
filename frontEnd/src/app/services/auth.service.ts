import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Subject } from 'rxjs';

@Injectable({
    providedIn:'root',
})


export class AuthService {
    private userSubject = new BehaviorSubject<any>(null);
    user$ = this.userSubject.asObservable();

    //loader
    private isLoadingSubject = new BehaviorSubject<boolean>(false); // Default is false (not loading)
  public isLoading$ = this.isLoadingSubject.asObservable();

  private fileUpdated = new Subject<void>();;
  fileUpdated$ = this.fileUpdated.asObservable();



    constructor(){
      const user= this.getUser();
      if(user){
        this.setUser(user);
      }
    }

    setToken(token:any){
        localStorage.setItem('token', JSON.stringify(token));
    }
    getToken() {
      return JSON.parse(localStorage.getItem('token') || 'null');
    }

    setUser(user:any){
      this.userSubject.next(user);
      localStorage.setItem('user', JSON.stringify(user));
    }

    getUser(){
      return JSON.parse(localStorage.getItem('user') || 'null');
    }

      logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.userSubject.next(null);
      }

      showLoader() {
        this.isLoadingSubject.next(true);
      }
    
      // Method to hide the loader
      hideLoader() {
        this.isLoadingSubject.next(false);
      }

      triggerFileUpdate(){
        this.fileUpdated.next();
      }

}