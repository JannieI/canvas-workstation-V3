/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';
import { UserPreferences }            from './models';

@Component({
    selector: 'collaborate-sendmessage',
    templateUrl: './collaborate.sendmessage.component.html',
    styleUrls: ['./collaborate.sendmessage.component.css']
})
export class CollaborateSendMessageComponent implements OnInit {

    @Output() formDashboardSendEmailClosed: EventEmitter<string> = new EventEmitter();

    toUsers: string;
    toGroups: string;
    subject: string;
    body: string;
    linked: boolean;

    
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
    }

    clickClose(action: string) {
        // Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');
        this.globalVariableService.showStatusBarMessage(
            {
                message: 'No changes',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );
		this.formDashboardSendEmailClosed.emit(action);
    }

    clickSave(action: string) {
        // Save data and Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // let data: UserPreferences = {
        //     preferenceAutoSync: this.preferenceAutoSync,
        //     preferenceShowOpenStartupMessage: this.preferenceShowOpenStartupMessage,
        //     preferenceShowOpenDataCombinationMessage: this.preferenceShowOpenDataCombinationMessage,
        //     preferenceShowViewStartupMessage: this.preferenceShowViewStartupMessage,
        //     preferenceShowDiscardStartupMessage: this.preferenceShowDiscardStartupMessage,
        //     preferenceDefaultTemplate: this.preferenceDefaultTemplate,
        //     preferenceDefaultDateformat: this.preferenceDefaultDateformat,
        //     preferenceDefaultFolder: this.preferenceDefaultFolder,
        //     preferenceDefaultPrinter: this.preferenceDefaultPrinter,
        //     preferenceDefaultPageSize: this.preferenceDefaultPageSize,
        //     preferenceDefaultPageLayout: this.preferenceDefaultPageLayout,
        // };

        // // Save globally, and in DB
        // this.globalVariableService.userPreferences = data;
        // this.globalVariableService.saveUserPreferences(data).then(
        //     res =>
        //         {
        //             this.globalVariableService.showStatusBarMessage(
        //                 {
        //                     message: 'Prefs saved',
        //                     uiArea: 'StatusBar',
        //                     classfication: 'Info',
        //                     timeout: 3000,
        //                     defaultMessage: ''
        //                 }
        //             );
        //         }
        // );
		this.formDashboardSendEmailClosed.emit(action);
    }

    //TODO
    //1. Set global var isFirstTimeDashboard = T/F depending on user input

}
