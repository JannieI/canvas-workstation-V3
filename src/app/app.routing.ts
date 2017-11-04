/*
 * Router Config
 */

import { ModuleWithProviders }        from '@angular/core/src/metadata/ng_module';
import { Routes, RouterModule }       from '@angular/router';

// Our Components
import { DashboardComponent }             from './dashboard.component';
import { HomeComponent }              from './home.component';
import { HelpComponent }              from './help.component';
import { DataComponent }              from './data.component';
import { GetDataComponent }           from './getdata.component';

// Own Services
import { AuthGuard }                  from './authguard.service';
import { GlobalVariableService }      from './global-variable.service';

export const ROUTES: Routes = [
    {path: '', redirectTo: 'help', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'data', component: DataComponent},
    {path: 'help', component: HelpComponent},
    {path: 'dashboard', component: DashboardComponent},
    {
        path: 'getdata', 
        component: GetDataComponent, 
        canActivate: [AuthGuard], 
        canDeactivate: [AuthGuard]
    },

];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
