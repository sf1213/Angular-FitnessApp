import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import {Subscription, Observable} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  //isAuth: boolean = false;
  isAuth$: Observable<boolean>;
  authSubscription: Subscription;
  @Output() closeSidenav = new EventEmitter<void>();

  constructor(private store: Store<fromRoot.State>, private authService: AuthService) { }

  ngOnInit() {
    // this.authService.authChange.subscribe(authStatus => {
    //   this.isAuth = authStatus;
    // });

    this.isAuth$ = this.store.select(fromRoot.getIsAuth); 
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

  // ngOnDestroy() {
  //   this.authSubscription.unsubscribe();
  // }

}
