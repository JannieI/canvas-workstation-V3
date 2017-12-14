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
import { CollaborateComponent }       from './collaborate.component';
import { ExploreComponent }           from './explore.component';
import { DataPopupComponent }         from './data.popup.component';
import { HelpComponent }              from './help.component';
import { HomeComponent }              from './home.component';
import { LandingComponent }           from './landing.component';
import { PresentComponent }           from './present.component';
import { WidgetEditorComponent }      from './widget.editor.component';
import { WidgetStepsComponent }       from './widget.steps.component';
import { DashboardNewComponent }      from './dashboard.new.component';
import { DashboardOpenComponent }     from './dashboard.open.component';
import { DashboardSaveComponent }     from './dashboard.save.component';
import { DashboardDiscardComponent }  from './dashboard.discard.component';
import { DashboardRenameComponent }   from './dashboard.rename.component';
import { DashboardCheckpointsComponent }   from './dashboard.checkpoints.component';
import { DashboardDetailsComponent }  from './dashboard.details.component';
import { DashboardDescriptionComponent }   from './dashboard.description.component';
import { DashboardTagsComponent }     from './dashboard.tags.component';
import { DashboardSettingsComponent } from './dashboard.settings.component';
import { DashboardThemeComponent }    from './dashboard.theme.component';
import { DashboardScheduleComponent } from './dashboard.schedule.component';
import { DashboardDeleteComponent }   from './dashboard.delete.component';
import { DashboardCommentsComponent } from './dashboard.comments.component';
import { DashboardPrintComponent }    from './dashboard.print.component';
import { MyProfileComponent }         from './myprofile.component';
import { PreferencesComponent }       from './preferences.component';
import { LoginComponent}              from './login.component';
import { LogoutComponent}             from './logout.component';

// Our Services
import { AuthGuard }                  from './authguard.service';
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

@NgModule({
    declarations: [
        AppComponent,
        CollaborateComponent,
        ExploreComponent,
        HomeComponent,
        HelpComponent,
        LandingComponent,
        PresentComponent,
        WidgetEditorComponent,
        WidgetStepsComponent,
        DashboardNewComponent,
        DashboardOpenComponent,
        DashboardSaveComponent,
        DashboardDiscardComponent,
        DashboardRenameComponent,
        DashboardCheckpointsComponent,
        DashboardDetailsComponent,
        DashboardDescriptionComponent,
        DashboardTagsComponent,
        DashboardSettingsComponent,
        DashboardThemeComponent,
        DashboardScheduleComponent,
        DashboardDeleteComponent,
        DashboardCommentsComponent,
        DashboardPrintComponent,
        DataPopupComponent,
        MyProfileComponent,
        PreferencesComponent,
        LoginComponent,
        LogoutComponent,
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
