/*
 * Router Config
 */

import { ModuleWithProviders }        from '@angular/core/src/metadata/ng_module';
import { Routes, RouterModule }       from '@angular/router';

// Our Components
import { ExploreComponent }           from './explore.component';
import { DataComponent }              from './data.component';
import { GetDataComponent }           from './getdata.component';
import { HomeComponent }              from './home.component';
import { HelpComponent }              from './help.component';
import { LandingComponent }           from './landing.component';
import { PresentComponent }           from './present.component';
import { CollaborateComponent }       from './collaborate.component';

// Own Services
import { AuthGuard }                  from './authguard.service';
import { GlobalVariableService }      from './global-variable.service';

export const ROUTES: Routes = [
    {path: '', redirectTo: 'landing', pathMatch: 'full'},
    {path: 'home',          component: HomeComponent},
    {path: 'collaborate',   component: CollaborateComponent},
    {path: 'data',          component: DataComponent},
    {path: 'explore',       component: ExploreComponent},
    {path: 'help',          component: HelpComponent},
    {path: 'present',       component: PresentComponent},
    {
        path: 'getdata', 
        component: GetDataComponent, 
        canActivate: [AuthGuard], 
        canDeactivate: [AuthGuard]
    },
    {path: '**', component: LandingComponent},
    
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
