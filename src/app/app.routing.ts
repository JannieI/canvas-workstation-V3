/*
 * Router Config
 */

import { ModuleWithProviders }        from '@angular/core/src/metadata/ng_module';
import { Routes, RouterModule }       from '@angular/router';

// Our Components
import { AboutComponent }             from './about.component';
import { HomeComponent }              from './home.component';
import { HelpComponent }              from './help.component';
import { GetDataComponent }           from './getdata.component';

// Own Services
import { AuthGuard }                  from './authguard.service';
import { GlobalVariableService }      from './global-variable.service';

export const ROUTES: Routes = [
    {path: '', redirectTo: 'help', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'help', component: HelpComponent},
    {path: 'about', component: AboutComponent},
    {
        path: 'getdata', 
        component: GetDataComponent, 
        canActivate: [AuthGuard], 
        canDeactivate: [AuthGuard]
    },

];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
