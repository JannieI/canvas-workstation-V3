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

    @Output() formWidgetContainerClosed: EventEmitter<Widget> = new EventEmitter();
    @Input() selectedWidget: Widget;

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

    backgroundcolors: CSScolor[];
    callingRoutine: string = '';
    colourPickerClosed: boolean = false;
    colourPickerSubscription: Subscription;
    containerBorderColour: string = 'black';
    containerBorderType: string = 'solid';
    containerBorderSize: string = '1';
    containerStyleID: number = null;
    containerSelectedStyleID: number = -1;
    containerSelectedStyleName: string = '';
    containerStyleName: string = '';
    containerStyleNameList: string[] = [];
    containerStyles: ContainerStyle[] = [];
    errorMessage: string;
    infoMessage: string;
    lineColor: string = 'none';
    lineSize: string = 'none';
    lineType: string = 'bold';
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

                    let localStyle: number = this.containerStyles.findIndex(cs =>
                        cs.id == this.localWidget.containerStyleID
                    );
                    if (localStyle != -1) {
                        this.containerSelectedStyleID = this.containerStyles[localStyle].id;
                        this.containerSelectedStyleName = this.containerStyles[localStyle].name;
                        this.updateForm(localStyle);
                        this.containerStyleName = this.containerStyles[localStyle].name +
                            ' (' + this.containerStyles[localStyle].id.toString() + ')';
                    };
                };
            };
        });

        // Deconstruct border
        if (this.selectedWidget.containerBorder != ''
            &&
            this.selectedWidget.containerBorder != 'none') {
                let space1: number = this.selectedWidget.containerBorder.indexOf(' ');
                if (space1 > 0) {
                    this.lineSize = this.selectedWidget.containerBorder.substr(0, space1);
                    let rest: string = this.selectedWidget.containerBorder.substr(space1 + 1, 999);

                    let space2: number = rest.indexOf(' ');
                    if (space2 > 0) {

                        this.lineType = rest.substr(0, space2)
                        this.lineColor = rest.substr(space2 + 1, 999);
                    };
                };
                console.warn('xx linestuff', this.lineSize, this.lineType,  this.lineColor);

        };
        console.warn('xx start Wcont', this.globalVariableService.currentWidgets)
        // Manage colour picker
        this.colourPickerSubscription = this.globalVariableService.colourPickerClosed.subscribe(clp => {

            if (this.localWidget != undefined  &&  clp != null) {

                if (clp.cancelled) {
                    this.colourPickerClosed = false;
                } else {

                    if (clp.callingRoutine == 'BgColour') {
                        this.colourPickerClosed = false;
                        this.localWidget.containerBackgroundcolor = clp.selectedColor;
                    };
                    if (clp.callingRoutine == 'LineColour') {
                        this.colourPickerClosed = false;
                        this.lineColor = clp.selectedColor;

                        // Construct line size
                        if (this.lineSize != 'none') {
                            this.localWidget.containerBorder = this.lineSize + ' ' + this.lineType + ' ' + this.lineColor;
                        };
                    };
                };
            };
        });

        // Get setup info
        this.backgroundcolors = this.globalVariableService.backgroundcolors.slice();

        // Deep copy original
        this.oldWidget = JSON.parse(JSON.stringify(this.selectedWidget));

        // Deep copy local copy
        this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));

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

        this.localWidget.containerBackgroundcolor = ev.target.value;
    }

    clickSelectLineColorPicker(ev: any) {
        // Open the Colour Picker for Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLineColorPicker', '@Start');

        this.selectedColour = this.lineColor;
        this.callingRoutine = 'LineColour';
        this.colourPickerClosed = true;
    }

    clickSelectLineColor(ev: any) {
        // Select Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLineColor', '@Start');

        this.lineColor = ev.target.value;

        // Construct line size
        if (this.lineSize != 'none') {
            this.localWidget.containerBorder = this.lineSize + ' ' + this.lineType + ' ' + this.lineColor;
        } else {
            this.localWidget.containerBorder = this.lineSize
        };
        console.warn('xx line', this.localWidget.containerBorder, this.lineColor, this.lineSize);

    }

    clickSelectLineSize(ev: any) {
        // Select Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLineSize', '@Start');

        this.lineSize = ev.target.value;

        // Construct line size
        if (this.lineSize != 'none') {
            this.localWidget.containerBorder = this.lineSize + ' ' + this.lineType + ' ' + this.lineColor;
        } else {
            this.localWidget.containerBorder = this.lineSize
        };
    }

    clickSelectLineType(ev: any) {
        // Select Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLineType', '@Start');

        this.lineType = ev.target.value;

        // Construct line size
        if (this.lineSize != 'none') {
            this.localWidget.containerBorder = this.lineSize + ' ' + this.lineType + ' ' + this.lineColor;
        } else {
            this.localWidget.containerBorder = this.lineSize
        };
    }

    clickSelectStyleName(ev: any) {
        // Style name was clicked in dropdown
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectStyleName', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        console.warn('xx', ev);
        let selectedContainerStyleName: string = ev.target.value;

        // Unselected
        if (selectedContainerStyleName == '') {
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
        };
        console.warn('xx this.dashboardTemplateID', this.containerSelectedStyleID, this.containerSelectedStyleName)

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
                this.localWidget.containerBorder = this.containerBorderSize + 'px ' +
                    this.containerBorderType + ' ' + this.containerBorderColour;
            } else {
                this.localWidget.containerBorder = 'none';
            };
        };

    }

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');
        console.log('clickClose')

		this.formWidgetContainerClosed.emit(null);
    }

    clickSave() {
        // Close form and save all
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Construct line size
        if (this.lineSize != 'none') {
            this.localWidget.containerBorder = this.lineSize + ' ' + this.lineType + ' ' + this.lineColor;
        } else {
            this.localWidget.containerBorder = this.lineSize
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
