/* 
 * Copyright Clarity Analytics.  All rights reserved
 *
 * Main Module, with menu
 */

// Angular
import { BrowserAnimationsModule }    from "@angular/platform-browser/animations";
import { BrowserModule }              from '@angular/platform-browser';
import { FormsModule }                from '@angular/forms';
import { HttpModule }                 from '@angular/http';
import { NgModule }                   from '@angular/core';
import { ROUTING }                    from "./app.routing";

// Clarity Framework
import { ClarityModule }              from 'clarity-angular';

// Own Components
import { AppComponent }               from './app.component';
import { DataComponent }              from "./data.component";
import { DashboardComponent }             from "./dashboard.component";
import { HelpComponent }              from "./help.component";
import { HomeComponent }              from "./home.component";
import { LandingComponent }           from "./landing.component";
import { GetDataComponent }           from './getdata.component';

// Our Services
import { AuthGuard }                  from './authguard.service';
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

@NgModule({
    declarations: [
        AppComponent,
        DataComponent,
        DashboardComponent,
        HomeComponent,
        HelpComponent,
        LandingComponent,
        GetDataComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        ClarityModule,
        ROUTING
    ],
    providers: [

        // Our Services
        AuthGuard,
        GlobalVariableService,
        GlobalFunctionService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    
}
