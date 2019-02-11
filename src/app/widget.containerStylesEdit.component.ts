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
    // colourPickerClosed: boolean = false;
    // colourPickerSubscription: Subscription;
    containerBackgroundcolor: string = 'transparent';
    containerBackgroundcolorName: string = 'transparent';
    containerBorder: string = '1px solid black';
    containerBorderColour: string = 'black';
    containerBorderColourName: string = 'Black';
    containerBorderRadius: string;
    containerBorderType: string = 'solid';
    containerBorderSize: string = '1px';
    containerBoxshadow: string;
    containerFontsize: number = 12;
    containerSelectedStyleID: number = -1;
    containerSelectedStyleName: string = '';
    containerStyleName: string = '';
    containerStyleNameList: string[] = [];
    containerStyles: ContainerStyle[] = [];
    errorMessage: string;
    gridStyleName: string;
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

        // Get list
        this.globalVariableService.getResource('containerStyles')
            .then(res => {
                this.containerStyles = res.slice();
                this.containerStyleNameList = [];
                this.containerStyles.forEach(cs => {
                    // List of ngFor (needs ID at later stage, state is useful for user)
                    this.containerStyleNameList.push(cs.name + ' (' + cs.id.toString() + ')');
                });

                // Fill Initial
                if (this.containerStyles.length >= 0) {
                    this.containerSelectedStyleID = this.containerStyles[0].id;
                    this.containerSelectedStyleName = this.containerStyles[0].name;
                    this.containerStyleName = this.containerStyles[0].name +
                        ' (' + this.containerStyles[0].id.toString() + ')';
                    this.updateForm(0);
                };
            })
            .catch(err => this.errorMessage = 'Error getting styles: ' + err);


        // Manage colour picker
        // this.colourPickerSubscription = this.globalVariableService.colourPickerClosed.subscribe(clp => {

        //     if (clp != null) {

        //         if (clp.cancelled) {
        //             this.colourPickerClosed = false;
        //         } else {

        //             if (clp.callingRoutine == 'BgColour') {
        //                 this.colourPickerClosed = false;
        //                 this.containerBackgroundcolor = clp.selectedColor;
        //             };
        //             if (clp.callingRoutine == 'LineColour') {
        //                 this.colourPickerClosed = false;
        //                 this.containerBorderColour = clp.selectedColor;

        //             };
        //         };
        //     };
        // });

        // Get setup info
        this.backgroundcolors = this.globalVariableService.backgroundcolors.slice();

    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        // this.colourPickerSubscription.unsubscribe();
    }

    clickSelectStyleName(ev: any) {
        // Style name was clicked in dropdown
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectStyleName', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        let selectedContainerStyleName: string = ev.target.value;

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

    }

    updateForm(localIndex: number) {
        // Update the form from the local Array with for a given index
        this.globalFunctionService.printToConsole(this.constructor.name,'updateForm', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        if (localIndex != -1) {

            this.containerBackgroundcolor = this.containerStyles[localIndex].
                containerBackgroundcolor;
            this.containerBackgroundcolorName = this.containerStyles[localIndex].
                containerBackgroundcolorName;
            this.containerBorderColour = this.containerStyles[localIndex].
                containerBorderColour;
            this.containerBorderColourName = this.containerStyles[localIndex].
                containerBorderColourName;

            if (this.containerStyles[localIndex].containerBorderRadius != null) {
                this.containerBorderRadius = this.containerStyles[localIndex].
                    containerBorderRadius.toString();
            } else {
                this.containerBorderRadius = null;
            };

            this.containerBorderSize = this.containerStyles[localIndex].
                containerBorderSize;
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


            // Construct Border
            if (this.containerBorderSize != 'none'  &&  this.containerBorderColour != 'none') {
                this.containerBorder = this.containerBorderSize + ' ' +
                    this.containerBorderType + ' ' + this.containerBorderColour;
            } else {
                this.containerBorder = 'none';
            };
        };

    }

    // clickSelectBgColorPicker(ev: any) {
    //     // Open the Colour Picker for Background Colour
    //     this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBgColorPicker', '@Start');

    //     // Reset
    //     this.errorMessage = '';
    //     this.infoMessage = '';

    //     this.selectedColour = this.containerBackgroundcolor;
    //     this.callingRoutine = 'BgColour';
    //     this.colourPickerClosed = true;
    // }

    clickSelectBgColor(ev: any) {
        // Select Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBgColor', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        this.containerBackgroundcolorName = ev.target.value;
        this.containerBackgroundcolor = this.containerBackgroundcolorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.containerBackgroundcolorName
        );
        if (localIndex >= 0) {
            this.containerBackgroundcolor = this.backgroundcolors[localIndex].cssCode;
        };
        
    }

    // clickSelectLineColorPicker(ev: any) {
    //     // Open the Colour Picker for Line Colour
    //     this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLineColorPicker', '@Start');

    //     // Reset
    //     this.errorMessage = '';
    //     this.infoMessage = '';

    //     this.selectedColour = this.containerBorderColour;
    //     this.callingRoutine = 'LineColour';
    //     this.colourPickerClosed = true;
    // }

    clickSelectBorderColor(ev: any) {
        // Select Border Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBorderColor', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        this.containerBorderColourName = ev.target.value;
        this.containerBorderColour = this.containerBorderColourName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.containerBorderColourName
        );
        if (localIndex >= 0) {
            this.containerBorderColour = this.backgroundcolors[localIndex].cssCode;
        };

        // Construct Border
        if (this.containerBorderSize != 'none'  &&  this.containerBorderColour != 'none') {
            this.containerBorder = this.containerBorderSize + ' ' +
                this.containerBorderType + ' ' + this.containerBorderColour;
        } else {
            this.containerBorder = 'none';
        };

    }

    clickSelectBorderSize(ev: any) {
        // Select Border Size
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBorderSize', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        this.containerBorderSize = ev.target.value;

        // Construct Border
        if (this.containerBorderSize != 'none'  &&  this.containerBorderColour != 'none') {
            this.containerBorder = this.containerBorderSize + ' ' +
                this.containerBorderType + ' ' + this.containerBorderColour;
        } else {
            this.containerBorder = 'none';
        };
    }

    clickSelectBorderType(ev: any) {
        // Select Border Type
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBorderType', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        this.containerBorderType = ev.target.value;

        // Construct Border
        if (this.containerBorderSize != 'none'  &&  this.containerBorderColour != 'none') {
            this.containerBorder = this.containerBorderSize + ' ' +
                this.containerBorderType + ' ' + this.containerBorderColour;
        } else {
            this.containerBorder = 'none';
        };
    }

    clickSelectBorderRadius(ev: any) {
        // Select Border Radius
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBorderRadius', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        this.containerBorderRadius = ev.target.value;

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

		this.formWidgetContainerStylesEditClosed.emit(null);
    }

    clickSave() {
        // Save the Container Style
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        // Validate
        if (this.containerSelectedStyleID == -1) {
            this.errorMessage = 'Invalid selection.';
            return;
        };

        // Create object
        let newContainerStyle: ContainerStyle = {
            id: this.containerSelectedStyleID,
            name: this.containerSelectedStyleName,
            containerBackgroundcolor: this.containerBackgroundcolor,
            containerBackgroundcolorName: this.containerBackgroundcolorName,
            containerBorderColour: this.containerBorderColour,
            containerBorderColourName: this.containerBorderColourName,
            containerBorderRadius: this.containerBorderRadius,
            containerBorderSize: this.containerBorderSize,
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

        // Save to DB
        this.globalVariableService.saveContainerStyle(newContainerStyle).then(res => {
            // Update local Array
            let localIndex: number = this.containerStyles.findIndex(cs =>
                cs.id == this.containerSelectedStyleID
            );
            this.containerStyles[localIndex] = newContainerStyle;
        });

        // Tell user
        this.infoMessage = 'Container Style saved';
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

    clickDelete() {
        // Delete the selected Container Style
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        // Validate
        if (this.containerSelectedStyleID == -1) {
            this.errorMessage = 'Invalid selection.';
            return;
        };
        if (this.containerStyles.length == 1) {
            this.errorMessage = 'Cannot delete the last one.';
            return;
        };
        let filteredWidgets: Widget[] = this.globalVariableService.widgets.filter(w => 
            w.containerStyleID == this.containerSelectedStyleID
        );
        if (filteredWidgets.length > 0) {
            this.errorMessage = 'No Delete - linked to ' + filteredWidgets.length.toString() + ' widget(s)';
            return;
        };

        // Update DB
        this.globalVariableService.deleteContainerStyle(this.containerSelectedStyleID).then(
            res => {

                this.infoMessage = 'Container Style deleted';

                // Update local Array
                this.containerStyles = this.containerStyles.filter(cs =>
                    cs.id != this.containerSelectedStyleID);

                // Reload dropdown displayed on form, and refresh info with first one
                this.containerStyleNameList = [];

                this.containerStyles.forEach(cs => {
                    // List of ngFor (needs ID at later stage, state is useful for user)
                    this.containerStyleNameList.push(cs.name + ' (' + cs.id.toString() + ')');
                });

                // Fill Initial
                if (this.containerStyles.length >= 0) {
                    this.containerSelectedStyleID = this.containerStyles[0].id;
                    this.containerSelectedStyleName = this.containerStyles[0].name;
                    this.updateForm(0);
                    this.containerStyleName = this.containerStyles[0].name +
                        ' (' + this.containerStyles[0].id.toString() + ')';
                };

                // Tell User
                this.infoMessage = 'Style deleted';
            }
        );
    }
}
