// Service to provide global variables
import { BehaviorSubject }            from 'rxjs/BehaviorSubject';
import { Injectable }                 from '@angular/core';

// Our Models
import { currentDatasource }          from './model.currentDashboard';

// import { CanvasUser }                 from './model.user';

const currentDatasources: currentDatasource [] = 
[
    {
        id: 1,
        name: 'My Expenses',
        type: 'Xls File',
        description: 'Personal expenses, with info per budget type.'
        
    },
    {
        id: 2,
        name: 'Bitcoin Trades',
        type: 'Database - PostgreSQL',
        description: 'Trades from Bitcoin Exchange'
    
    }
]

@Injectable()
export class GlobalVariableService {

    currentDatasources: currentDatasource[] = currentDatasources;
    isFirstTime: boolean = true;    
    xlOpenGetDataWizard: boolean = false;                          // Open/Not the Get Data Wizard
    showNavData = new BehaviorSubject<boolean>(false);             // Show sideNav
    showNavDashboard = new BehaviorSubject<boolean>(false);        // Show sideNav
    showNavFormat = new BehaviorSubject<boolean>(false);           // Show sideNav
    showSubMenuData = new BehaviorSubject<boolean>(false);         // Show Sub Menu for Data
    showSubMenuDashboard = new BehaviorSubject<boolean>(false);    // Show Sub Menu for Dashboard
    // Company related variables
    // companyName: string = 'Clarity Analytics';                  // Optional, set in SystemConfig
    // companyLogo: string = '';                                   // Optional file name, set in SystemConfig

    // System-wide related variables, set at Installation
    // systemConfigurationID: number = -1;
    // backendName: string = 'Eazl';
    // backendUrl: string = '';                                    // RESTi url, set in SystemConfig
    // defaultDaysToKeepResultSet: number = 1;                     // Optional, set in SystemConfig
    // frontendName: string = 'Canvas';
    // maxRowsDataReturned: number = 1000000;                      // Optional, set in SystemConfig
    // maxRowsPerWidgetGraph: number = 1;                          // Optional, set in SystemConfig
    // systemTitle: string = 'Canvas';

    // Current User
    // canvasUser = new BehaviorSubject<CanvasUser>(null);
    // isAuthenticatedOnEazl: boolean = false;        // True if authenticated

    // This session
    // showSystemConfigButtons: boolean = true;       // Menu option called = True: SystemConfiguration, False: System Info
    // sessionDateTimeLoggedin: string = '';
    // sessionDashboardTabID: number = null;          // Tab ID to load when form opens, -1 = none
    sessionDebugging: boolean = false;
    sessionLogging: boolean = false;
    // sessionLoadOnOpenDashboardID: number = null;   // Dashboard to load when form opens, 0 = none
    // sessionLoadOnOpenDashboardName: string = '';   // Dashboard to load when form opens, '' = none

    // At startup
    // startupDashboardID: number = 0;                             // Dashboard to load @start, 0 = none
    // startupDashboardTabID: number = 0;                          // Tab ID to load @start, -1 = none
    // startupMessageToShow: string = '';                          // Message to show at start

    // Environment
    // testEnvironmentName: string = '';                           // Spaces = in PROD

    // Dirtiness of system (local) data: True if dirty (all dirty at startup)
    // dirtyDataTextAlignDropdown: boolean = true;
    // dirtyDataBorderDropdown: boolean = true;
    // dirtyDataBoxShadowDropdown: boolean = true;
    // dirtyDataBackgroundImageDropdown: boolean = true;
    // dirtyDataDashboardTab: boolean = true;
    // dirtyDataCanvasMessage: boolean = true;
    // dirtyDataCanvasMessageRecipient: boolean = true;
    // dirtyDataDashboardTag: boolean = true;
    // dirtyDataDashboardTagMembership: boolean = true;
    // dirtyDataDashboard: boolean = true;
    // dirtyDataDatasource: boolean = true;
    // dirtyDataFilter: boolean = true;
    // dirtyDataFontSizeDropdown: boolean = true;
    // dirtyDataFontWeightDropdown: boolean = true;
    // dirtyDataGraphType: boolean = true;
    // dirtyDataGridSizeDropdown: boolean = true;
    // dirtyDataGroup: boolean = true;
    // dirtyDataImageSourceDropdown: boolean = true;
    // dirtyDataPackageTask: boolean = true;
    // dirtyDataReport: boolean = true;
    // dirtyDataReportWidgetSet: boolean = true;
    // dirtyDataReportHistory: boolean = true;
    // dirtyDataSystemConfiguration: boolean = true;
    // dirtyDataTextMarginDropdown: boolean = true;
    // dirtyDataTextPaddingDropdown: boolean = true;
    // dirtyDataTextPositionDropdown: boolean = true;
    // dirtyDataWidget: boolean = true;
    // dirtyDataWidgetTemplate: boolean = true;
    // dirtyDataWidgetType: boolean = true;
    // dirtyDataUser: boolean = true;

    // System & operation config
    // averageWarningRuntime: number = 0;
    // defaultWidgetConfiguration: string = '';
    // dashboardIDStartup: number = null;
    // defaultReportFilters: string = '';
    // environment: string = '';
    // frontendColorScheme: string = '';
    // growlSticky: boolean = false;
    // growlLife: number = 3000;
    // gridSize: number = 3;
    // snapToGrid: boolean = true;

    // Settings that can be set via UI for next time, from then on it will change
    // as the user uses them, and used the next time (a Widget is created)
    // lastContainerFontSize: SelectedItem =
    //     {
    //         id: 1,
    //         name: '1'
    //     };
    // lastColor: SelectedItemColor =
    //     {
    //         id: 'black',
    //         name: 'black',
    //         code: '#000000'
    //     };
    // lastBoxShadow: SelectedItem =
    //     {
    //         id:1,
    //         name: ''
    //     };
    // lastBorder: SelectedItem =
    //     {
    //         id:1,
    //         name: '1px solid black'
    //     };
    // lastBackgroundColor: SelectedItemColor =
    //     {
    //         id: 'white',
    //         name: 'white',
    //         code: '#FFFFFF'
    //     };
    // lastWidgetHeight: number = 300;
    // lastWidgetWidth: number = 400;
    // lastWidgetLeft: number = 25;
    // lastWidgetTop: number = 80;

    private messageSource = new BehaviorSubject<string>("default message");
    currentMessage = this.messageSource.asObservable();
    menuCreateDisabled = new BehaviorSubject<boolean>(false);

    constructor() { }

    changeMessage(message: string) {
        console.log('changeMessage', message)
        this.messageSource.next(message)
    }

    changeMenuCreateDisabled(value: boolean) {
        this.menuCreateDisabled.next(value);
    }
}