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
    selector: 'widget-containerStylesEdit',
    templateUrl: './widget.containerStylesEdit.component.html',
    styleUrls: ['./widget.containerStylesEdit.component.css']
})
export class WidgetContainerStylesEditComponent implements OnInit {

    @Output() formWidgetContainerStylesEditClosed: EventEmitter<Widget> = new EventEmitter();

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
    containerBackgroundcolor: string = 'transparent';
    containerBorder: string = '1px solid black';
    containerBorderColour: string = 'black';
    containerBorderRadius: string;
    containerBorderType: string = 'solid';
    containerBorderSize: string = '1';
    containerBoxshadow: string;
    containerFontsize: number = 12;
    containerSelectedStyleID: number = -1;
    containerStyleName: string = '';
    containerStyleNameList: string[] = [];
    containerStyles: ContainerStyle[] = [];
    errorMessage: string;
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

        // Get list
        this.globalVariableService.getContainerStyles().then(res => {
            this.containerStyles = res; 
            this.containerStyles.forEach(cs => {
                // List of ngFor (needs ID at later stage, state is useful for user)
                this.containerStyleNameList.push(cs.name + ' (' + cs.id.toString() + ')');
            });   
            // Fill Initial
            if (this.containerStyles.length >= 0) {
                this.updateForm(0);
                this.containerStyleName = this.containerStyles[0].name + 
                    ' (' + this.containerStyles[0].id.toString() + ')';
            };
        });

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

    clickSelectStyleName(ev: any) {
        // Style name was clicked in dropdown
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectStyleName', '@Start');

        console.warn('xx', ev);
        let selectedContainerStyleName: string = ev.target.value;

        // Get the ID
        this.containerSelectedStyleID = -1;
        let openBracket: number = selectedContainerStyleName.indexOf('(');
        let closeBracket: number = selectedContainerStyleName.indexOf(')');
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
        console.warn('xx this.dashboardTemplateID', this.containerSelectedStyleID)
    
    }

    updateForm(localIndex: number) {
        // Update the form from the local Array with for a given index
        this.globalFunctionService.printToConsole(this.constructor.name,'updateForm', '@Start');

        if (localIndex != -1) {
            this.containerBackgroundcolor = this.containerStyles[localIndex].
                containerBackgroundcolor;
            this.containerBorderColour = this.containerStyles[localIndex].
                containerBorderColour;

            if (this.containerStyles[localIndex].containerBorderRadius != null) {
                this.containerBorderRadius = this.containerStyles[localIndex].
                    containerBorderRadius.toString();
            } else {
                this.containerBorderRadius = null;
            };
            
            if (this.containerStyles[localIndex].containerBorderSize != null) {
                this.containerBorderSize = this.containerStyles[localIndex].
                    containerBorderSize.toString();
            } else {
                this.containerBorderSize = null;
            };

            this.containerBorderType = this.containerStyles[localIndex].
                containerBorderType;
            this.containerBoxshadow = this.containerStyles[localIndex].
                containerBoxshadow;
            this.containerFontsize = this.containerStyles[localIndex].containerFontsize;
            this.shapeFontFamily = this.containerStyles[localIndex].shapeFontFamily;
            this.shapeIsBold = this.containerStyles[localIndex].shapeIsBold;
            this.shapeIsItalic = this.containerStyles[localIndex].shapeIsItalic;
            this.shapeLineHeight = this.containerStyles[localIndex].shapeLineHeight;
            this.shapeTextAlign = this.containerStyles[localIndex].shapeTextAlign;
        };

    }

    clickSelectBgColorPicker(ev: any) {
        // Open the Colour Picker for Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBgColorPicker', '@Start');

        this.selectedColour = this.containerBackgroundcolor;
        this.callingRoutine = 'BgColour';
        this.colourPickerClosed = true;
    }

    clickSelectBgColor(ev: any) {
        // Select Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBgColor', '@Start');

        this.containerBackgroundcolor = ev.target.value;
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

        this.shapeTextAlign = ev.target.value;

    }
    
    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');
        console.log('clickClose')

		this.formWidgetContainerStylesEditClosed.emit(null);
    }

    clickSave() {
        // Save the Container Style
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Add to DB
        let newContainerStyle: ContainerStyle = {
            id: this.containerSelectedStyleID,
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

        this.globalVariableService.saveContainerStyle(newContainerStyle).then(res => {
            console.warn('xx res', res);
            
        });

        // Tell user
        this.globalVariableService.showStatusBarMessage(
            {
                message: 'Container Style saved',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );
    }

}
