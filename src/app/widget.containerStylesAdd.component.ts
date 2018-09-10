/*
 * Specify properties about the W container
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
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
    selector: 'widget-containerStylesAdd',
    templateUrl: './widget.containerStylesAdd.component.html',
    styleUrls: ['./widget.containerStylesAdd.component.css']
})
export class WidgetContainerStylesAddComponent implements OnInit {

    @Output() formWidgetContainerStylesAddClosed: EventEmitter<Widget> = new EventEmitter();

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
            this.clickAdd();
            return;
        };

    }

    backgroundcolors: CSScolor[];
    callingRoutine: string = '';
    colourPickerClosed: boolean = false;
    colourPickerSubscription: Subscription;
    containerStyleName: string = '';
    containerBackgroundcolor: string = 'transparent';
    containerBorder: string = '1px solid black';
    containerBorderColour: string = 'black';
    containerBorderRadius: string;
    containerBorderType: string = 'solid';
    containerBorderSize: string = '1';
    containerBoxshadow: string;
    containerFontsize: number = 12;
    errorMessage: string;
    infoMessage: string;
    oldWidget: Widget;
    selectedColour: string;
    shapeFontFamily: string;                // Font, ie Aria, Sans Serif
    shapeIsBold: boolean;                   // True if text is bold
    shapeIsItalic: boolean;                 // True if text is italic
    shapeLineHeight: string;                // Line Height: normal, 1.6, 80%
    shapeText: string = 'Test text';
    shapeTextAlign: string = 'Left';        // Align text Left, Center, Right


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ){}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Manage colour picker
        this.colourPickerSubscription = this.globalVariableService.colourPickerClosed.subscribe(clp => {

            if (clp != null) {

                if (clp.cancelled) {
                    this.colourPickerClosed = false;
                } else {

                    if (clp.callingRoutine == 'BgColour') {
                        this.colourPickerClosed = false;
                        this.containerBackgroundcolor = clp.selectedColor;
                    };
                    if (clp.callingRoutine == 'LineColour') {
                        this.colourPickerClosed = false;
                        this.containerBorderColour = clp.selectedColor;

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

    clickSelectBgColorPicker(ev: any) {
        // Open the Colour Picker for Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBgColorPicker', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        this.selectedColour = this.containerBackgroundcolor;
        this.callingRoutine = 'BgColour';
        this.colourPickerClosed = true;
    }

    clickSelectBgColor(ev: any) {
        // Select Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBgColor', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        this.containerBackgroundcolor = ev.target.value;
    }

    clickSelectLineColorPicker(ev: any) {
        // Open the Colour Picker for Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLineColorPicker', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        this.selectedColour = this.containerBorderColour;
        this.callingRoutine = 'LineColour';
        this.colourPickerClosed = true;
    }

    clickSelectLineColor(ev: any) {
        // Select Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLineColor', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        this.containerBorderColour = ev.target.value;

        // Construct line size
        if (this.containerBorderSize != 'none'  &&  this.containerBorderColour != 'none') {
            this.containerBorder = this.containerBorderSize + 'px ' + 
                this.containerBorderType + ' ' + this.containerBorderColour;
        } else {
            this.containerBorder = 'none';
        };
        console.warn('xx line', this.containerBorder);

    }

    clickSelectLineSize(ev: any) {
        // Select Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLineSize', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        this.containerBorderSize = ev.target.value;

        // Construct line size
        if (this.containerBorderSize != 'none'  &&  this.containerBorderColour != 'none') {
            this.containerBorder = this.containerBorderSize + 'px ' + 
                this.containerBorderType + ' ' + this.containerBorderColour;
        } else {
            this.containerBorder = 'none';
        };
        console.warn('xx line', this.containerBorder);
    }

    clickSelectLineType(ev: any) {
        // Select Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLineType', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        this.containerBorderType = ev.target.value;

        // Construct line size
        if (this.containerBorderSize != 'none'  &&  this.containerBorderColour != 'none') {
            this.containerBorder = this.containerBorderSize + 'px ' + 
                this.containerBorderType + ' ' + this.containerBorderColour;
        } else {
            this.containerBorder = 'none';
        };
        console.warn('xx line', this.containerBorder);
    }

    clickSelectTextAlign(ev: any) {
        // Select Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTextAlign', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        this.shapeTextAlign = ev.target.value;

    }
    
    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');
        console.log('clickClose')

		this.formWidgetContainerStylesAddClosed.emit(null);
    }

    clickAdd() {
        // Add a new Container Style
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        // Validation
        if (this.containerStyleName == '') {
            this.errorMessage = 'The name is compulsory.';
            return;
        };

        // Add to DB
        let newContainerStyle: ContainerStyle = {
            id: null,
            name: this.containerStyleName,
            containerBackgroundcolor: this.containerBackgroundcolor,
            containerBorderColour: this.containerBorderColour,
            containerBorderRadius: +this.containerBorderRadius,
            containerBorderSize: this.containerBorderSize=='none'? 0 : +this.containerBorderSize,
            containerBorderType: this.containerBorderType,
            containerBoxshadow: this.containerBoxshadow,
            containerFontsize: this.containerFontsize,
            shapeFontFamily: this.shapeFontFamily,
            shapeIsBold: this.shapeIsBold,
            shapeIsItalic: this.shapeIsItalic,
            shapeLineHeight: this.shapeLineHeight,
            shapeTextAlign: this.shapeTextAlign,
            containerCreatedOn: new Date(),
            containerCreatedBy: this.globalVariableService.currentUser.userID,
            containerUpdatedOn: null,
            containerUpdatedBy: null,
        
        };
console.warn('xx newContainerStyle', newContainerStyle);

        this.globalVariableService.addContainerStyle(newContainerStyle).then(res => {

        });

        // Tell user
        this.infoMessage = 'Container Style added';
        this.globalVariableService.showStatusBarMessage(
            {
                message: 'Container Style added',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );
    }

}
