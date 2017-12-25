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
import { HomeComponent }              from './home.component';
import { LandingComponent }           from './landing.component';

import { ExploreComponent }           from './explore.component';
import { DashboardNewComponent }      from './dashboard.new.component';
import { DashboardOpenComponent }     from './dashboard.open.component';
import { DashboardSaveComponent }     from './dashboard.save.component';
import { DashboardDiscardComponent }  from './dashboard.discard.component';
import { DashboardRenameComponent }   from './dashboard.rename.component';
import { DashboardSnapshotsComponent }      from './dashboard.snapshots.component';
import { DashboardDetailsComponent }  from './dashboard.details.component';
import { DashboardDescriptionComponent }    from './dashboard.description.component';
import { DashboardTagsComponent }     from './dashboard.tags.component';
import { DashboardSettingsComponent } from './dashboard.settings.component';
import { DashboardThemeComponent }    from './dashboard.theme.component';
import { DashboardTemplateComponent } from './dashboard.template.component';
import { DashboardScheduleComponent } from './dashboard.schedule.component';
import { DashboardDeleteComponent }   from './dashboard.delete.component';
import { DashboardCommentsComponent } from './dashboard.comments.component';
import { DashboardPrintComponent }    from './dashboard.print.component';
import { DashboardTabComponent }      from './dashboard.tab.component';
import { DashboardHelpComponent }     from './dashboard.help.component';
import { DashboardHelpPresentationComponent }     from './dashboard.helpPresentation.component';
import { DashboardTreeviewComponent } from './dashboard.treeview.component';

import { WidgetEditorComponent }      from './widget.editor.component';
import { WidgetCheckpointsComponent }       from './widget.checkpoints.component';
import { WidgetLinksComponent }       from './widget.links.component';
import { WidgetExpandComponent }      from './widget.expand.component';
import { WidgetExportComponent }      from './widget.export.component';
import { WidgetDeleteComponent }      from './widget.delete.component';
import { WidgetNotesComponent }       from './widget.notes.component';

import { ShapeDeleteComponent }       from './shape.delete.component';

import { DataPopupComponent }         from './data.popup.component';
import { DataCombinationComponent }   from './data.combination.component';
import { DataSlicersComponent }       from './data.slicers.component';
import { DataRefreshComponent }       from './data.refresh.component';

import { ShapeEditComponent }         from './shape.edit.component';

import { PresentComponent }           from './present.component';
import { HelpComponent }              from './help.component';

import { CollaborateComponent }       from './collaborate.component';
import { CollaborateAlertsComponent } from './collaborate.alerts.component';
import { CollaborateMessagesComponent }     from './collaborate.messages.component';
import { CollaborateActivitiesComponent }   from './collaborate.activities.component';

import { LoginComponent}              from './login.component';
import { MyProfileComponent }         from './myprofile.component';
import { PreferencesComponent }       from './preferences.component';
import { UserWidgetButtonBarComponent}      from './user.widget.buttonbar.component';
import { UserShapeButtonBarComponent} from './user.shape.buttonbar.component';
import { SystemSettingsComponent }    from './systemsettings.component';
import { UserOfflineComponent}        from './user.offline.component';
import { LogoutComponent}             from './logout.component';

// Our Services
import { AuthGuard }                  from './authguard.service';
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

// Testing
import { DelayDirective }             from './test.delay.directive';
import { CardComponent }              from './test.app.card.component';
import { MyNgIfDirective }              from './test.ngif.directive';

@NgModule({
    declarations: [
        AppComponent,
        ExploreComponent,
        HomeComponent,
        HelpComponent,
        LandingComponent,
        PresentComponent,

        DashboardNewComponent,
        DashboardOpenComponent,
        DashboardSaveComponent,
        DashboardDiscardComponent,
        DashboardRenameComponent,
        DashboardSnapshotsComponent,
        DashboardDetailsComponent,
        DashboardDescriptionComponent,
        DashboardTagsComponent,
        DashboardSettingsComponent,
        DashboardThemeComponent,
        DashboardTemplateComponent,
        DashboardScheduleComponent,
        DashboardDeleteComponent,
        DashboardCommentsComponent,
        DashboardPrintComponent,
        DashboardTabComponent,
        DashboardHelpComponent,
        DashboardHelpPresentationComponent,
        DashboardTreeviewComponent,
        DataPopupComponent,
        DataCombinationComponent,
        DataSlicersComponent,
        DataRefreshComponent,

        WidgetEditorComponent,
        WidgetCheckpointsComponent,
        WidgetLinksComponent,
        WidgetExpandComponent,
        WidgetExportComponent,
        WidgetDeleteComponent,
        WidgetNotesComponent,

        ShapeEditComponent,
        ShapeDeleteComponent,

        CollaborateComponent,
        CollaborateAlertsComponent,
        CollaborateMessagesComponent,
        CollaborateActivitiesComponent,

        MyProfileComponent,
        PreferencesComponent,
        UserWidgetButtonBarComponent,
        UserShapeButtonBarComponent,
        SystemSettingsComponent,
        UserOfflineComponent,
        LoginComponent,
        LogoutComponent,

        CardComponent,
        DelayDirective,
        MyNgIfDirective,
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
