// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { Output }                     from '@angular/core';

// Our models
import { CSScolor }                   from './models';
import { DashboardTab }               from './models';

// Our Services
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';
 
// Other
import { Subscription }               from 'rxjs';


@Component({
    selector: 'dashboard-tab',
    templateUrl: './dashboard.tab.component.html',
    styleUrls: ['./dashboard.tab.component.css']
})
export class DashboardTabComponent {

    @Input() newTab: boolean;
    @Output() formDashboardTabClosed: EventEmitter<DashboardTab> = new EventEmitter();

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
            this.clickSave();
            return;
        };
 
    }

    dashboardID: number;                  // FK to DashboardID to which widget belongs
    name: string = '';                    // Name of new T
    description: string = '';             // T description
    backgroundColor: string = 'white';    // Bg Color of T
    color: string = 'black';              // CSS color of T
    showErrorMessage: boolean = false;
    errorMessageText: string = '';

    backgroundcolors: CSScolor[];
    callingRoutine: string = '';
    colourPickerClosed: boolean = false;
    colourPickerSubscription: Subscription;

    lineColor: string = 'none';
    selectedColour: string;


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        if (!this.newTab) {
            let tabIndex: number = this.globalVariableService.currentDashboardTabs
                .findIndex(t => t.id == this.globalVariableService.currentDashboardInfo
                    .value.currentDashboardTabID);
            if (tabIndex >= 0) {
                this.name = this.globalVariableService.currentDashboardTabs[tabIndex].name;
                this.description = this.globalVariableService.currentDashboardTabs[tabIndex]
                    .description;
                this.backgroundColor = this.globalVariableService.currentDashboardTabs[tabIndex]
                    .backgroundColor;
                this.color = this.globalVariableService.currentDashboardTabs[tabIndex].color;
            };
        };

        // Manage colour picker
        this.colourPickerSubscription = this.globalVariableService.colourPickerClosed.subscribe(clp => {

            if (clp != null) {

                if (clp.cancelled) {
                    this.colourPickerClosed = false;
                } else {
 
                    if (clp.callingRoutine == 'BgColour') {
                        this.colourPickerClosed = false;
                        this.backgroundColor = clp.selectedColor;
                    };
                    if (clp.callingRoutine == 'Colour') {
                        this.colourPickerClosed = false;
                        this.color = clp.selectedColor;
                    };
                    if (clp.callingRoutine == 'BorderColour') {
                        this.colourPickerClosed = false;
                        this.lineColor = clp.selectedColor;
                    };

                };
            };
        });

        // Get setup info
        this.backgroundcolors = this.globalVariableService.backgroundcolors.slice();
                
    }
   
    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        this.colourPickerSubscription.unsubscribe();
    }

    clickSelectBgColor(ev: any) {
        // Select Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBgColor', '@Start');

        this.backgroundColor = ev.target.value;
    }

    clickSelectBgColorPicker(ev: any) {
        // Open the Colour Picker for Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBgColorPicker', '@Start');

        this.selectedColour = this.backgroundColor;
        this.callingRoutine = 'BgColour';
        this.colourPickerClosed = true;
    }
      
    clickSelectColor(ev: any) {
        // Select text Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectColor', '@Start');

        this.color = ev.target.value;
    }

    clickSelectColorPicker(ev: any) {
        // Open the Colour Picker for text Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectColorPicker', '@Start');

        this.selectedColour = this.color;
        this.callingRoutine = 'Colour';
        this.colourPickerClosed = true;
    }

  	clickClose() {
        // Close form, no save
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

	  	  this.formDashboardTabClosed.emit(null);
    }

  	clickSave() {
        // Save new Tab, and close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Validation
        this.showErrorMessage = false;
        this.errorMessageText = '';

        if (this.name == ''  ||  this.name.length > 20) { 
            this.showErrorMessage = true;
            this.errorMessageText = 'Please enter a name, and less than 20 char';
        };

        if (this.description == '') { 
            this.showErrorMessage = true;
            this.errorMessageText = 'Please enter a description';
        };

        if (this.showErrorMessage) {
            return;
        }

        // Add new one
        if (this.newTab) {
            let newTab: DashboardTab = {
                id: null,
                originalID: null,
                dashboardID: this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                name: this.name,
                description: this.description,
                displayOrder: this.globalVariableService.currentDashboardTabs.length + 1,
                backgroundColor: this.backgroundColor,
                color: this.color,
                editedBy: '',
                editedOn: null,
                createdBy: '',
                createdOn: null
            }

            this.globalVariableService.addDashboardTab(newTab).then(res => {

                // Browse to it
                this.globalVariableService.refreshCurrentDashboard(
                    'tabNew-clickSave',
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                    0,
                    'Last'
                );

                newTab.id = res.id;
                this.formDashboardTabClosed.emit(newTab);
        
            });
        } else {
            let tab: DashboardTab = {
                id: this.globalVariableService.currentDashboardInfo.value
                    .currentDashboardTabID,
                originalID: null,
                dashboardID: this.globalVariableService.currentDashboardInfo.value
                    .currentDashboardID,
                name: this.name,
                description: this.description,
                displayOrder: 0,
                backgroundColor: this.backgroundColor,
                color: this.color,
                editedBy: '',
                editedOn: null,
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: new Date()
            };

            this.globalVariableService.saveDashboardTab(tab).then(res => {
                this.formDashboardTabClosed.emit(tab)
            });
        }
    }
  }