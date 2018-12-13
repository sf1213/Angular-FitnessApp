import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription, Observable } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { Store } from "@ngrx/store";
//import * as fromApp from '../../app.reducer'
import { map } from 'rxjs/operators';
import * as fromRoot from '../../app.reducer';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm : FormGroup;
  isLoading = false;
  isLoading$: Observable<boolean>;
  private loadingSub: Subscription;
  
  
  constructor(private authService: AuthService, 
              private uiService: UIService,
              private store: Store<fromRoot.State>
              ) { }

  ngOnInit() {
    //this.isLoading$ = this.store.pipe(map(state => state.ui.isLoading));
    // this.loadingSub = this.uiService.loadingStateChanged.subscribe(isLoading => {
    //   this.isLoading = isLoading;
    // });
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.loginForm = new FormGroup({
      email: new FormControl('', {validators: [Validators.required, Validators.email]}
        
      ),
      password: new FormControl('', Validators.required)
    });
  }
  
  onSubmit() {
    // console.log(this.loginForm);
    // console.log(this.loginForm.errors); 
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  // ngOnDestroy() {
  //   this.loadingSub.unsubscribe();
  // }

}
