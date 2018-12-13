import { CanActivate } from "@angular/router";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import { take} from 'rxjs/operators';



@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private store: Store<fromRoot.State>, private router: Router, private authService: AuthService) {}
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // if (this.authService.isAuth()) {
        //     return true;
        // } else {
        //     this.router.navigate(['/login']);
        // }

        return this.store.select(fromRoot.getIsAuth); //give us observabla, in the end true or false
    }

    canLoad(route: Route) {
        // if (this.authService.isAuth()) {
        //   return true;
        // } else {
        //   this.router.navigate(['/login']);
        // }

        return this.store.select(fromRoot.getIsAuth).pipe(take(1)); //take 1 value, then close this subscription
      }

}