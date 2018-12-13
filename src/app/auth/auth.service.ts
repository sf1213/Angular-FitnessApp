import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import {Subject} from "rxjs/Subject";
import { Injectable } from "@angular/core";
import {Router} from "@angular/router";
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from "../training/training.service";
import { UIService } from "../shared/ui.service";
import { Store } from "@ngrx/store";
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {
    // private isAuthenticated = false;
    // authChange = new Subject<boolean>();
    

    constructor(private router: Router, 
        private afauth: AngularFireAuth, 
        private trainingService: TrainingService,
        private uiService: UIService,
        private store: Store<fromRoot.State>
    ){}
 
    //initialize when app start (app.component.ts)
    initAuthListerner() {
        this.afauth.authState.subscribe(user => {
            console.log("initAuthListerner: "+ user);
            if (user) {  //login
                //this.isAuthenticated = true;
                //this.authChange.next(true); //true: login
                this.store.dispatch(new Auth.SetAuthenticated());
                this.router.navigate(['/training']);
            } else {   //logout
                
                // this.isAuthenticated = false;
                // this.authChange.next(false); //false: logout
                this.store.dispatch(new Auth.SetUnauthenticated());
                this.trainingService.cancelSubscriptions();
                this.router.navigate(['/login']);
            }
        })
    }


    registerUser(authData: AuthData) {
        //this.store.dispatch({type: 'START_LOADING'});
        //this.uiService.loadingStateChanged.next(true);

        this.store.dispatch(new UI.StartLoading());
        this.afauth.auth
        .createUserWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            console.log("registerUser: "+ result);
            //this.uiService.loadingStateChanged.next(false);
            //this.store.dispatch({ type: 'STOP_LOADING' });
            this.store.dispatch(new UI.StopLoading());

        })
        .catch(err => {
            //this.store.dispatch({ type: 'STOP_LOADING' });
            //this.uiService.showSnackbar(err.message, null, 3000);
            this.store.dispatch(new UI.StopLoading());
            this.uiService.loadingStateChanged.next(false);
        });
    }

    login(authData: AuthData) {
        //this.store.dispatch({type: 'START_LOADING'});
        //this.uiService.loadingStateChanged.next(true);
        this.store.dispatch(new UI.StartLoading());
        this.afauth.auth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            console.log("login" + result);
            this.store.dispatch(new UI.StopLoading());
            //this.store.dispatch({ type: 'STOP_LOADING' });
            //this.uiService.loadingStateChanged.next(false);
        })
        .catch(err => {
            this.store.dispatch(new UI.StopLoading());
            //this.store.dispatch({ type: 'STOP_LOADING' });
            //this.uiService.showSnackbar(err.message, null, 3000);
            this.uiService.loadingStateChanged.next(false);
        });
        
    }

    logout() {
        this.afauth.auth.signOut();  
    }

    // isAuth() {
    //     return this.isAuthenticated;
    // }


}