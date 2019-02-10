/*
 * Create a new Dashboard
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';
import { DashboardTab }               from './models';
import { DashboardLayout }            from './models';
import { WidgetLayout }               from './models';

@Component({
    selector: 'dashboard-new',
    templateUrl: './dashboard.new.component.html',
    styleUrls: ['./dashboard.new.component.css']
})
export class DashboardNewComponent implements OnInit {

    @Output() formDashboardNewClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
            return;
        };
        if (
            (event.code == 'Enter'  ||  event.code == 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickCreate();
            return;
        };

    }

    dashboardCode: string = '';
    dashboardLayouts: DashboardLayout[] = [];
    dashboardName: string = '';
    dashboardDescription: string = '';
    errorMessage: string = '';
    importFolder: string;
    importedDashboard: Dashboard = null;
    reader = new FileReader();
    selectedLayoutIndex: number = 0;        // Start with Blank Layout seleted
    theFile: any;
    widgetLayouts: WidgetLayout[] = [];



    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // TODO - put in DB later on
        this.dashboardLayouts = [
            {
              id: 1,
              dashboardID: 68,
              name: "Blank",
              description: "Blank layout, no blocks",
              imageUrl: '../images/Dashboard Layout Blank.png',
              editedBy: '',
              editedOn: null,
              createdBy: '',
              createdOn: null
            },
            {
              id: 2,
              dashboardID: 69,
              name: "3 x 5 with 5 blocks",
              description: "3 x 5 with 5 blocks",
              imageUrl: '../images/Dashboard Layout 5 x 3.png',
              editedBy: '',
              editedOn: null,
              createdBy: '',
              createdOn: null
            }
        ];
        this.widgetLayouts = [

            {
              id: 1,
              dashboardLayoutID: 2,
              top: 75,
              left: 15,
              height: 529,
              width: 456,
              editedBy: '',
              editedOn: null,
              createdBy: '',
              createdOn: null
            },
            {
              id: 2,
              dashboardLayoutID: 2,
              top: 75,
              left: 486,
              height: 320,
              width: 798,
              editedBy: '',
              editedOn: null,
              createdBy: '',
              createdOn: null
            },
            {
              id: 3,
              dashboardLayoutID: 2,
              top: 409,
              left: 490,
              height: 195,
              width: 251,
              editedBy: '',
              editedOn: null,
              createdBy: '',
              createdOn: null
            },
            {
              id: 4,
              dashboardLayoutID: 2,
              top: 409,
              left: 761,
              height: 195,
              width: 251,
              editedBy: '',
              editedOn: null,
              createdBy: '',
              createdOn: null
            },
            {
              id: 5,
              dashboardLayoutID: 2,
              top: 409,
              left: 1033,
              height: 195,
              width: 251,
              editedBy: '',
              editedOn: null,
              createdBy: '',
              createdOn: null
            }
        ];



    }

    clickFileBrowse() {
        // Browse for file to import
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFileBrowse', '@Start');

        if ( (<any>window).File && (<any>window).FileReader && (<any>window).FileList && window.Blob) {
            console.warn('xx Start Great success! All the File APIs are supported.')
          } else {
            alert('The File APIs are not fully supported in this browser.');
        };

        // TODO alert('Later: File component to browse ...')
        var inp: any = document.getElementById("get-files");

        // Return if nothing selected
        if (inp.files.length == 0) {
            return;
        };

        // Access and handle the files
        this.theFile = inp.files[0];
        console.warn('xx pre readAsText', this.theFile, this.theFile.name, this.theFile.type, this.theFile.size, this.theFile.lastModifiedDate, this.theFile.lastModifiedDate.toLocaleDateString())

        // Read file as Text

        this.reader.onerror = this.errorHandler;
        this.reader.onprogress = this.updateProgress;
        this.reader.onload = (theFile) =>{ this.loadFile(theFile) };

        // Read in the image file as a data URL.
        this.reader.readAsText(this.theFile);
        console.warn('xx Post readAsText')
    }

    loadFile(theFile) {
        // Callback for loading File
        console.warn('loadFile', '@Start');

        this.importedDashboard = JSON.parse(JSON.parse(theFile.target.result))
        this.dashboardCode = this.importedDashboard.code;
        this.dashboardName = this.importedDashboard.name;
        this.dashboardDescription = this.importedDashboard.description;

    }

    abortRead() {
        // Cancelled reading File
        console.warn('abortRead', '@Start');

        this.reader.abort();
    }

    errorHandler(evt) {
        // Handling errors on File load
        console.warn('errorHandler', '@Start');

        switch(evt.target.error.code) {
          case evt.target.error.NOT_FOUND_ERR:
            alert('File Not Found!');
            break;
          case evt.target.error.NOT_READABLE_ERR:
            alert('File is not readable');
            break;
          case evt.target.error.ABORT_ERR:
            break; // noop
          default:
            alert('An error occurred reading this file.');
        };
    }

    updateProgress(evt) {
        // Update event to show progress on file load
        console.warn('updateProgress', '@Start');

        // evt is an ProgressEvent.
        if (evt.lengthComputable) {
            var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
            // Increase the progress bar length.
            if (percentLoaded < 100) {
                console.warn('xx % loaded', percentLoaded)
                // progress.style.width = percentLoaded + '%';
                // progress.textContent = percentLoaded + '%';
            };
        };
    }

    clickImage(index: number, id: number) {
        // Clicked a layout image
        this.globalFunctionService.printToConsole(this.constructor.name,'clickImage', '@Start');

        this.selectedLayoutIndex = index;
		console.warn('xx id', id, index);

    }

    clickClose() {
        // Close form, no action
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardNewClosed.emit('Cancel');
    }

    clickCreate() {
        // Create a new Dashboard, and close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCreate', '@Start');

        if (this.dashboardCode == '') {
            this.errorMessage = 'Code compulsory';
            return;
        };
        if (this.dashboardName == '') {
            this.errorMessage = 'Name compulsory';
            return;
        };
        if (this.dashboardDescription == '') {
            this.errorMessage = 'Description compulsory';
            return;
        };

        // Reset
        this.errorMessage = '';

        // Create new D
        let newDashboard: Dashboard = this.globalVariableService.dashboardTemplate;
        newDashboard.code = this.dashboardCode;
        newDashboard.name = this.dashboardName;
        newDashboard.description = this.dashboardDescription;
        newDashboard.creator = this.globalVariableService.currentUser.userID;

        if (this.importedDashboard != null) {
            newDashboard.accessType = this.importedDashboard.accessType;
            newDashboard.backgroundColor = this.importedDashboard.backgroundColor;
            newDashboard.backgroundImage = this.importedDashboard.backgroundImage;
            newDashboard.defaultExportFileType = this.importedDashboard.defaultExportFileType;
            newDashboard.defaultTabID = this.importedDashboard.defaultTabID;
            newDashboard.isSample = this.importedDashboard.isSample;
            newDashboard.qaRequired = this.importedDashboard.qaRequired;
            newDashboard.templateDashboardID = this.importedDashboard.templateDashboardID;
            newDashboard.url = this.importedDashboard.url;
            newDashboard.version = this.importedDashboard.version;
        };

        // Add new (Complete + Draft) to DB, and open Draft
        newDashboard.state = 'Complete';

        // Add Original D
        this.globalVariableService.addDashboard(newDashboard).then(newD => {

            // Add Draft D
            newDashboard.state = 'Draft';
            newDashboard.originalID = newD.id;
            this.globalVariableService.addDashboard(newDashboard).then(draftD => {

                // Reset draftID on Original
                newD.draftID = draftD.id;
                this.globalVariableService.saveDashboard(newD).then(originalD => {

                    // Add Original Tab to DB
                    let newDashboardTab: DashboardTab = this.globalVariableService.dashboardTabTemplate;
                    newDashboardTab.dashboardID = newD.id;
                    this.globalVariableService.addDashboardTab(newDashboardTab).then(originalTab => {

                        // Add Draft Tab to DB
                        let newDashboardTab: DashboardTab = this.globalVariableService.dashboardTabTemplate;
                        newDashboardTab.dashboardID = draftD.id;
                        newDashboardTab.originalID = originalTab.id;
                        this.globalVariableService.addDashboardTab(newDashboardTab).then(draftTab => {

                            // Amend Recent list
                            this.globalVariableService.amendDashboardRecent(draftD.id, draftTab.id).then(dR => {

                                // Add the Dashboard Layout, other than Blank
                                if (this.selectedLayoutIndex > 0) {
                                    let dashboardLayoutID: number =
                                        this.dashboardLayouts[this.selectedLayoutIndex].id;
                                    let newDashboardLayout: DashboardLayout =
                                        this.dashboardLayouts[this.selectedLayoutIndex];
                                    newDashboardLayout._id = null;
                                    newDashboardLayout.id = null;
                                    newDashboardLayout.dashboardID = draftD.id;
                                    this.globalVariableService.addDashboardLayout(newDashboardLayout)
                                        .then(res => {
                                            this.widgetLayouts.forEach(wl => {
                                                if (wl.dashboardLayoutID == dashboardLayoutID) {
                                                    let newWidgetLayout: WidgetLayout = wl;
                                                    newWidgetLayout._id = null;
                                                    newWidgetLayout.id = null;
                                                    newWidgetLayout.dashboardLayoutID = res.id;
                                                    this.globalVariableService.addWidgetLayout(
                                                        newWidgetLayout
                                                    ).then(res => {
                                                        this.globalVariableService.refreshCurrentDashboard(
                                                            'addDashboard-clickCreate', draftD.id, draftTab.id, ''
                                                        );
                                                    });
                                                };
                                        });
                                    });
                                } else {
                                    this.globalVariableService.refreshCurrentDashboard(
                                        'addDashboard-clickCreate', draftD.id, draftTab.id, ''
                                    );
                                };
                                this.formDashboardNewClosed.emit('Created');
                            });
                        });
                    });
                });
            });
        });

    }
}
