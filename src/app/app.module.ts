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
import { LandingComponent }           from './landing.component';

import { ExploreComponent }           from './explore.component';
import { DashboardNewComponent }      from './dashboard.new.component';
import { DashboardOpenComponent }     from './dashboard.open.component';
import { DashboardSaveComponent }     from './dashboard.save.component';
import { DashboardDiscardComponent }  from './dashboard.discard.component';
import { DashboardRenameComponent }   from './dashboard.rename.component';
import { DashboardSnapshotsComponent }      from './dashboard.snapshots.component';
import { DashboardShareComponent }    from './dashboard.share.component';
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
import { DashboardHelpPresentationComponent }  from './dashboard.helpPresentation.component';
import { DashboardTreeviewComponent } from './dashboard.treeview.component';
import { DashboardSubscribeComponent }         from './dashboard.subscribe.component';
import { DashboardImportComponent }   from './dashboard.import.component';

import { WidgetEditorComponent }      from './widget.editor.component';
import { WidgetCheckpointsComponent }       from './widget.checkpoints.component';
import { WidgetLinksComponent }       from './widget.links.component';
import { WidgetExpandComponent }      from './widget.expand.component';
import { WidgetExportComponent }      from './widget.export.component';
import { WidgetDeleteComponent }      from './widget.delete.component';
import { WidgetCommentsComponent }    from './widget.comments.component';

import { ShapeDeleteComponent }       from './shape.delete.component';

import { DataPopupComponent }         from './data.popup.component';
import { DataCombinationComponent }   from './data.combination.component';
import { DataSlicersComponent }       from './data.slicers.component';
import { DataRefreshComponent }       from './data.refresh.component';
import { DatasourceShareComponent }   from './data.share.component';

import { ShapeEditComponent }         from './shape.edit.component';

import { HelpComponent }              from './help.component';

import { CollaborateAlertsComponent } from './collaborate.alerts.component';
import { CollaborateMessagesComponent }     from './collaborate.messages.component';
import { CollaborateActivitiesComponent }   from './collaborate.activities.component';
import { CollaborateActivityAddComponent }  from './collaborate.activityadd.component';

import { LoginComponent}              from './login.component';
import { MyProfileComponent }         from './myprofile.component';
import { PreferencesComponent }       from './preferences.component';
import { UserWidgetButtonBarComponent}      from './user.widget.buttonbar.component';
import { UserShapeButtonBarComponent} from './user.shape.buttonbar.component';
import { SystemSettingsComponent }    from './systemsettings.component';
import { UserOfflineComponent}        from './user.offline.component';
import { LogoutComponent}             from './logout.component';

import { PipeFilterDSType }           from './pipe.filter.component';


// Our Services
import { AuthGuard }                  from './authguard.service';
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

// Testing
import { DelayDirective }             from './test.delay.directive';
import { MyNgIfDirective }            from './test.ngif.directive';
import { WidgetComponent }            from './test.component';
import { StatusbarComponent }         from './statusbar.component';

@NgModule({
    declarations: [

        // Main
        AppComponent,
        ExploreComponent,
        HelpComponent,
        LandingComponent,

        DashboardNewComponent,
        DashboardOpenComponent,
        DashboardSaveComponent,
        DashboardDiscardComponent,
        DashboardRenameComponent,
        DashboardSnapshotsComponent,
        DashboardShareComponent,
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
        DashboardSubscribeComponent,
        DashboardImportComponent,
        DataPopupComponent,
        DataCombinationComponent,
        DataSlicersComponent,
        DataRefreshComponent,
        DatasourceShareComponent,

        WidgetEditorComponent,
        WidgetCheckpointsComponent,
        WidgetLinksComponent,
        WidgetExpandComponent,
        WidgetExportComponent,
        WidgetDeleteComponent,
        WidgetCommentsComponent,

        ShapeEditComponent,
        ShapeDeleteComponent,

        CollaborateAlertsComponent,
        CollaborateMessagesComponent,
        CollaborateActivitiesComponent,
        CollaborateActivityAddComponent,

        MyProfileComponent,
        PreferencesComponent,
        UserWidgetButtonBarComponent,
        UserShapeButtonBarComponent,
        SystemSettingsComponent,
        UserOfflineComponent,
        LoginComponent,
        LogoutComponent,

        DelayDirective,
        MyNgIfDirective,

        PipeFilterDSType,
        WidgetComponent,
        StatusbarComponent,


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
