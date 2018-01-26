/*
 * Router Config
 */

import { ModuleWithProviders }        from '@angular/core/src/metadata/ng_module';
import { Routes, RouterModule }       from '@angular/router';

// Our Components
// import { ExploreComponent }           from './explore.component';
import { DataPopupComponent }         from './data.popup.component';
import { HelpComponent }              from './help.component';
import { LandingComponent }           from './landing.component';
// import { WidgetExpandComponent }      from './widget.expand.component';

// Own Services
import { AuthGuard }                  from './authguard.service';
import { GlobalVariableService }      from './global-variable.service';

export const ROUTES: Routes = [
    {path: '', redirectTo: '', pathMatch: 'full'},
    {path: 'data',          component: DataPopupComponent},
    // {path: 'explore',       component: ExploreComponent},
    {path: 'help',          component: HelpComponent},
    // {path: 'expand',        component: WidgetExpandComponent},

    // {
    //     path: 'getdata',
    //     component: GetDataComponent,
    //     canActivate: [AuthGuard],
    //     canDeactivate: [AuthGuard]
    // },
    {path: '**', component: LandingComponent},

];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
