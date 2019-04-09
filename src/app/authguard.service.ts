// Guards the routes - returns True / False if user can proceed with route
import { ActivatedRouteSnapshot }     from '@angular/router';
import { CanActivate }                from '@angular/router';
import { DOCUMENT }                   from '@angular/platform-browser';
import { Inject }                     from "@angular/core";
import { Injectable }                 from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Router }                     from '@angular/router';
import { Routes }                     from '@angular/router';
import { RouterStateSnapshot }        from '@angular/router';

// Our Services

@Injectable()
export class AuthGuard implements OnInit, CanActivate {

    constructor(
        // private alertService: AlertService,
        private router: Router,
        @Inject(DOCUMENT) private document: Document,

        ) { }

    ngOnInit() {
        //   Form initialisation
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // Obtain the username from the global variables

        // If not logged in, bail

        let oldRouterPath: string = state.url[0]['path'];

        if (oldRouterPath === 'getdata') {
            console.log ('here')
        };

        // All good
        return true;
   }

    canDeactivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, router: Router, routes: Routes) {
        // Run deactivation in AuthGuard

        let oldRouterPath: string = state.url[0]['path'];

        if (oldRouterPath === 'path that needs confirmation') {
            // return window.confirm('Demo to prevent leaving Canvas.  Do you really want to go to ' + routes['url'] + ' ?');
        }
        if (oldRouterPath === 'path that needs to set background for') {

            // Set the document / body background color
            // this.document.body.style.backgroundColor =  frontendColorScheme;
            // this.document.body.style.backgroundImage = '';
        }

        // Return
        return true;
    }
}
