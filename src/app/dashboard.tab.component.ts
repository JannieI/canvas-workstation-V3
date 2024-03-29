/*
 * Shows form to add, amend the properties of a Dashboard Tab
 */

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
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };
        if (
            (event.code === 'Enter'  ||  event.code === 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickSave();
            return;
        };

    }

    
    backgroundColor: string = 'white';    // Actual Bg Color of T
    backgroundColorName: string = 'White';    // Name of Bg Color of T
    backgroundcolors: CSScolor[];
    callingRoutine: string = '';
    color: string = 'black';              // Actual CSS color of T
    colorName: string = 'Black';          // Name of CSS color of T
    colourPickerClosed: boolean = false;
    colourPickerSubscription: Subscription;
    displayOrder: number;
    dashboardID: number;                  // FK to DashboardID to which widget belongs
    description: string = '';             // T description
    errorMessage: string = '';
    name: string = '';                    // Name of new T
    selectedColour: string;
    showErrorMessage: boolean = false;


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        if (!this.newTab) {
            this.globalVariableService.getResource(
                'dashboardTabs', 
                '?filterObject={"id": ' + this.globalVariableService
                .currentDashboardInfo.value.currentDashboardTabID + '}'
                ).then(res => {

                    if (res  &&  res.length > 0) {
                        this.name = res[0].name;
                        this.description = res[0].description;
                        this.backgroundColor = res[0].backgroundColor;
                        this.backgroundColorName = res[0].backgroundColorName;
                        this.color = res[0].color;
                        this.colorName = res[0].colorName;
                        this.displayOrder = res[0].displayOrder;
                    };
                })
                .catch(err => {
                    this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                    console.error('Error in Dashboard.tab finding dashboardTabs: ' + err);
                });
        };

        // Manage colour picker
        this.colourPickerSubscription = this.globalVariableService.colourPickerClosed
            .subscribe(clp => {

            if (clp != null) {

                if (clp.cancelled) {
                    this.colourPickerClosed = false;
                } else {

                    if (clp.callingRoutine === 'BgColour') {
                        this.colourPickerClosed = false;
                        this.backgroundColor = clp.selectedColor;
                        this.backgroundColorName = 'Open Picker ...';
                    };
                    if (clp.callingRoutine === 'Colour') {
                        this.colourPickerClosed = false;
                        this.color = clp.selectedColor;
                        this.colorName = 'Open Picker ...';
                    };

                };
            };
        });

        // Get setup info
        this.globalVariableService.getResource('canvasBackgroundcolors')
            .then(res => {
                this.backgroundcolors = res;
                this.backgroundcolors = [
                    {id: null, name: 'Open Picker ...', cssCode: '', shortList: false}, 
                    {id: null, name: 'No Fill', cssCode: 'transparent', shortList: false},
                    ...this.backgroundcolors
                ];
            })
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                console.error('Error in Dashboard.tab reading canvasBackgroundcolors: ' + err);
            });
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

        // this.backgroundColor = ev.target.value;

        // Open Picker if selected
        if (ev.target.value === 'Open Picker ...') {
            this.clickSelectBgColorPicker(null);
        };

        this.backgroundColorName = ev.target.value;
        this.backgroundColor = this.backgroundColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name === this.backgroundColorName
        );
        if (localIndex >= 0) {
            this.backgroundColor = this.backgroundcolors[localIndex].cssCode;
        };

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

        // this.color = ev.target.value;

        // Open Picker if selected
        if (ev.target.value === 'Open Picker ...') {
            this.clickSelectColorPicker(null);
        };

        this.colorName = ev.target.value;
        this.color = this.colorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name === this.colorName
        );
        if (localIndex >= 0) {
            this.color = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectColorPicker(ev: any) {
        // Open the Colour Picker for text Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectColorPicker', '@Start');

        this.selectedColour = this.color;
        this.callingRoutine = 'Colour';
        this.colourPickerClosed = true;
    }

  	clickClose(action: string) {
        // Close form, no save
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

	  	  this.formDashboardTabClosed.emit(null);
    }

  	clickSave() {
        // Save new Tab, and close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Validation
        this.showErrorMessage = false;
        this.errorMessage = '';

        if (this.name === ''  ||  this.name.length > 20) {
            this.showErrorMessage = true;
            this.errorMessage = 'Please enter a name, and less than 20 char';
        };

        if (this.description === '') {
            this.showErrorMessage = true;
            this.errorMessage = 'Please enter a description';
        };

        if (this.showErrorMessage) {
            return;
        }

        // Add new one, incre displayOrder
        let displayOrderNew: number = 0;
        this.globalVariableService.currentDashboardTabs.forEach(t => {
            if (t.displayOrder > displayOrderNew) {
                displayOrderNew = t.displayOrder + 1;
            };
        });

        if (this.newTab) {
            let newTab: DashboardTab = {
                id: null,
                originalID: null,
                dashboardID: this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                name: this.name,
                description: this.description,
                displayOrder: displayOrderNew,
                backgroundColor: this.backgroundColor,
                backgroundColorName: this.backgroundColorName,
                color: this.color,
                colorName: this.colorName,
                editedBy: '',
                editedOn: null,
                createdBy: '',
                createdOn: null
            }

            this.globalVariableService.addResource('dashboardTabs', newTab)
                .then(res => {

                    // Browse to it
                    this.globalVariableService.refreshCurrentDashboard(
                        'tabNew-clickSave',
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                        0,
                        'Last'
                    );

                    newTab.id = res.id;
                    this.formDashboardTabClosed.emit(newTab);

                })
                .catch(err => {
                    this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                    console.error('Error in Dashboard.tab adding dashboardTabs: ' + err);
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
                displayOrder: this.displayOrder,
                backgroundColor: this.backgroundColor,
                backgroundColorName: this.backgroundColorName,
                color: this.color,
                colorName: this.colorName,
                editedBy: '',
                editedOn: null,
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: new Date()
            };

            this.globalVariableService.saveResource('dashboardTabs', tab)
                .then(res => {
                    this.formDashboardTabClosed.emit(tab)
                })
                .catch(err => {
                    this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                    console.error('Error in Dashboard.tab saving dashboardTabs: ' + err);
                });
        }
    }
  }