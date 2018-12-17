/*
 * Specify properties about the W container
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Models
import { CSScolor }                   from './models';
import { ContainerStyle }             from './models';
import { Widget }                     from './models';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Other
import { Subscription }               from 'rxjs';

@Component({
    selector: 'widget-container',
    templateUrl: './widget.container.component.html',
    styleUrls: ['./widget.container.component.css']
})
export class WidgetContainerComponent implements OnInit {

    @Input() selectedWidget: Widget;
    @Output() formWidgetContainerClosed: EventEmitter<Widget> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
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

    backgroundcolors: CSScolor[];
    callingRoutine: string = '';
    colourPickerClosed: boolean = false;
    colourPickerSubscription: Subscription;
    containerBorderColour: string = 'black';
    containerBorderColourName: string = 'black';
    containerBorderType: string = 'solid';
    containerBorderSize: string = '1px';
    containerStyleID: number = null;
    containerSelectedStyleID: number = -1;
    containerSelectedStyleName: string = '';
    containerStyleName: string = '';
    containerStyleNameList: string[] = [];
    containerStyles: ContainerStyle[] = [];
    errorMessage: string;
    infoMessage: string;
    localWidget: Widget;                            // W to modify, copied from selected
    oldWidget: Widget;
    selectedColour: string;


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ){}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Deep copy original
        this.oldWidget = JSON.parse(JSON.stringify(this.selectedWidget));

        // Deep copy local copy - Note: this must be done at the start of this method
        this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));
        this.containerBorderColourName = this.localWidget.containerBorderColourName;

        // Get setup info
        this.backgroundcolors = this.globalVariableService.backgroundcolors.slice();
        this.backgroundcolors = [
            {id: null, name: 'Open Picker ...', cssCode: '', shortList: false}, ...this.backgroundcolors
        ];

        // Get list of Styles
        this.globalVariableService.getContainerStyles().then(res => {
            this.containerStyles = res;
            this.containerStyleNameList = [''];
            this.containerStyles.forEach(cs => {
                // List of ngFor (needs ID at later stage, state is useful for user)
                this.containerStyleNameList.push(cs.name + ' (' + cs.id.toString() + ')');
            });

            // Fill Initial
            if (this.containerStyles.length >= 0) {

                // Load if linked
                if (this.localWidget.containerStyleID != null) {

                    let localStyleIndex: number = this.containerStyles.findIndex(cs =>
                        cs.id == this.localWidget.containerStyleID
                    );
                    if (localStyleIndex != -1) {
                        this.containerSelectedStyleID = this.containerStyles[localStyleIndex].id;
                        this.containerSelectedStyleName = this.containerStyles[localStyleIndex].name;
                        this.updateForm(localStyleIndex);
                        this.containerStyleName = this.containerStyles[localStyleIndex].name.trim() +
                            ' (' + this.containerStyles[localStyleIndex].id.toString() + ')';

                    };
                };
            };
        });

        // Deconstruct border
        if (this.localWidget.containerBorder != ''
            &&
            this.localWidget.containerBorder != 'none') {
                let space1: number = this.localWidget.containerBorder.indexOf(' ');
                if (space1 > 0) {
                    this.containerBorderSize = this.localWidget.containerBorder.
                        substr(0, space1).trim();
                    let rest: string = this.localWidget.containerBorder.substr(space1 + 1, 999);

                    let space2: number = rest.indexOf(' ');
                    if (space2 > 0) {

                        this.containerBorderType = rest.substr(0, space2).trim();
                        this.containerBorderColour = rest.substr(space2 + 1, 999).trim();
                    };
                };

        };

        // Manage colour picker
        this.colourPickerSubscription = this.globalVariableService.colourPickerClosed.subscribe(clp => {

            if (this.localWidget != undefined  &&  clp != null) {

                if (clp.cancelled) {
                    this.colourPickerClosed = false;
                } else {

                    if (clp.callingRoutine == 'BgColour') {
                        this.colourPickerClosed = false;
                        this.localWidget.containerBackgroundcolor = clp.selectedColor;
                        this.localWidget.containerBackgroundcolorName = 'Open Picker ...';
                    };
                    if (clp.callingRoutine == 'LineColour') {
                        this.colourPickerClosed = false;
                        this.containerBorderColour = clp.selectedColor;
                        this.containerBorderColourName = 'Open Picker ...';

                        // Construct line size
                        if (this.containerBorderSize != 'none') {
                            this.localWidget.containerBorder = this.containerBorderSize + ' ' + this.containerBorderType + ' ' + this.containerBorderColour;
                        };

                        // Reset
                        clp.callingRoutine = '';
                    };
                };
            };
        });

    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        this.colourPickerSubscription.unsubscribe();
    }

    clickSelectBgColorPicker(ev: any) {
        // Open the Colour Picker for Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBgColorPicker', '@Start');

        this.selectedColour = this.localWidget.containerBackgroundcolor;
        this.callingRoutine = 'BgColour';
        this.colourPickerClosed = true;
    }

    clickSelectBgColor(ev: any) {
        // Select Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBgColor', '@Start');

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectBgColorPicker(null);
        };

        this.localWidget.containerBackgroundcolorName = ev.target.value;
        this.localWidget.containerBackgroundcolor = this.localWidget.containerBackgroundcolorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.containerBackgroundcolorName
        );
        if (localIndex >= 0) {
            this.localWidget.containerBackgroundcolor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectLineColorPicker(ev: any) {
        // Open the Colour Picker for Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLineColorPicker', '@Start');

        this.selectedColour = this.containerBorderColour;
        this.callingRoutine = 'LineColour';
        this.colourPickerClosed = true;
    }

    clickSelectLineColor(ev: any) {
        // Select Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLineColor', '@Start');

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectLineColorPicker(null);
        };
        this.containerBorderColourName = ev.target.value;
        this.containerBorderColour = this.containerBorderColourName;
        let bgIndex: number = this.backgroundcolors.findIndex(
            bg => bg.name == this.containerBorderColourName);
        if (bgIndex >= 0) {
            this.containerBorderColour = this.backgroundcolors[bgIndex].cssCode;
        };

        // Construct line size
        if (this.containerBorderSize != 'none') {
            this.localWidget.containerBorder = this.containerBorderSize + ' ' + this.containerBorderType + ' ' + this.containerBorderColour;
        } else {
            this.localWidget.containerBorder = this.containerBorderSize
        };

    }

    clickSelectLineSize(ev: any) {
        // Select Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLineSize', '@Start');

        this.containerBorderSize = ev.target.value;

        // Construct line size
        if (this.containerBorderSize != 'none') {
            this.localWidget.containerBorder = this.containerBorderSize + ' ' + this.containerBorderType + ' ' + this.containerBorderColour;
        } else {
            this.localWidget.containerBorder = this.containerBorderSize
        };
    }

    clickSelectLineType(ev: any) {
        // Select Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLineType', '@Start');

        this.containerBorderType = ev.target.value;

        // Construct line size
        if (this.containerBorderSize != 'none') {
            this.localWidget.containerBorder = this.containerBorderSize + ' ' + this.containerBorderType + ' ' + this.containerBorderColour;
        } else {
            this.localWidget.containerBorder = this.containerBorderSize
        };
    }

    clickSelectStyleName(ev: any) {
        // Style name was clicked in dropdown
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectStyleName', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        let selectedContainerStyleName: string = ev.target.value;

        // None selected
        if (selectedContainerStyleName == '') {

            this.containerSelectedStyleName = '';
            this.containerSelectedStyleID = -1;
            return;
        };

        // Get the ID
        this.containerSelectedStyleID = -1;
        let openBracket: number = selectedContainerStyleName.indexOf('(');
        let closeBracket: number = selectedContainerStyleName.indexOf(')');
        this.containerSelectedStyleName = selectedContainerStyleName.substring(0, openBracket);
        this.containerSelectedStyleID = +selectedContainerStyleName.
            substring(openBracket + 1, closeBracket);

        // Find row and update form
        if (this.containerSelectedStyleID != -1) {
            let localIndex: number = this.containerStyles.findIndex(cs =>
                cs.id == this.containerSelectedStyleID
            );
            if (localIndex != -1) {
                this.updateForm(localIndex);
            };

            // Set the Style ID
            this.localWidget.containerStyleID =  this.containerSelectedStyleID;
        };

    }

    updateForm(localIndex: number) {
        // Update the form from the local Array with for a given index
        this.globalFunctionService.printToConsole(this.constructor.name,'updateForm', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        if (localIndex != -1) {

            this.localWidget.containerBackgroundcolor = this.containerStyles[localIndex].
                containerBackgroundcolor;
            this.localWidget.containerBackgroundcolorName = this.containerStyles[localIndex].
                containerBackgroundcolorName;
            this.containerBorderColour = this.containerStyles[localIndex].
                containerBorderColour;

            if (this.containerStyles[localIndex].containerBorderRadius != null) {
                this.localWidget.containerBorderRadius = this.containerStyles[localIndex].
                    containerBorderRadius.toString();
            } else {
                this.localWidget.containerBorderRadius = null;
            };

            if (this.containerStyles[localIndex].containerBorderSize != null) {
                this.containerBorderSize = this.containerStyles[localIndex].
                    containerBorderSize.toString();
            } else {
                this.containerBorderSize = null;
            };

            this.containerBorderType = this.containerStyles[localIndex].
                containerBorderType;
            this.localWidget.containerBoxshadow = this.containerStyles[localIndex].
                containerBoxshadow;
            this.localWidget.containerFontsize = this.containerStyles[localIndex].containerFontsize;
            this.localWidget.shapeFontFamily = this.containerStyles[localIndex].shapeFontFamily;
            this.localWidget.shapeIsBold = this.containerStyles[localIndex].shapeIsBold;
            this.localWidget.shapeIsItalic = this.containerStyles[localIndex].shapeIsItalic;
            this.localWidget.shapeLineHeight = this.containerStyles[localIndex].shapeLineHeight;
            this.localWidget.shapeTextAlign = this.containerStyles[localIndex].shapeTextAlign;

            // Construct line size
            if (this.containerBorderSize != 'none'  &&  this.containerBorderColour != 'none') {
                this.localWidget.containerBorder = this.containerBorderSize + ' ' +
                    this.containerBorderType + ' ' + this.containerBorderColour;
            } else {
                this.localWidget.containerBorder = 'none';
            };
        };

    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');
        console.log('clickClose')

		this.formWidgetContainerClosed.emit(null);
    }

    clickSave() {
        // Close form and save all
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Construct Border
        this.localWidget.containerBorderColourName = this.containerBorderColourName;

        if (this.containerBorderSize != 'none') {
            this.localWidget.containerBorder = this.containerBorderSize + ' ' + this.containerBorderType + ' ' + this.containerBorderColour;
        } else {
            this.localWidget.containerBorder = this.containerBorderSize
        };

        // Remove Style IF
        if (this.containerSelectedStyleName == '') {
            this.localWidget.containerStyleID = null;
        };

        // Replace the W - DB and local vars
        this.globalVariableService.saveWidget(this.localWidget).then(res => {
            // this.globalVariableService.widgetReplace(this.localWidget);
                    // Action
                    // TODO - cater for errors + make more generic
                    let actID: number = this.globalVariableService.actionUpsert(
                        null,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                        this.localWidget.id,
                        'Widget',
                        'Edit',
                        'Update Container',
                        'W Containter clickSave',
                        null,
                        null,
                        this.oldWidget,
                        this.localWidget,
                        false               // Dont log to DB yet
                    );

        });

        // Tell user
        this.globalVariableService.showStatusBarMessage(
            {
                message: 'Container updated',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );

	  	this.formWidgetContainerClosed.emit(this.localWidget);
    }

}
