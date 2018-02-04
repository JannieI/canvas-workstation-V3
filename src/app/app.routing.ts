/*
 * Router Config
 */

import { ModuleWithProviders }        from '@angular/core/src/metadata/ng_module';
import { Routes, RouterModule }       from '@angular/router';

// Our Components
import { HelpComponent }              from './help.component';
import { LandingComponent }           from './landing.component';

// Own Services
import { AuthGuard }                  from './authguard.service';
import { GlobalVariableService }      from './global-variable.service';

export const ROUTES: Routes = [
    {path: '', redirectTo: '', pathMatch: 'full'},
    {path: 'help',          component: HelpComponent},
    {path: '**', component: LandingComponent},

];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
