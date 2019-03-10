/*
 * Shows form to specify the properties for a Widget container
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
// import { Subscription }               from 'rxjs';

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
            this.clickAdd();
            return;
        };

    }

    backgroundcolors: CSScolor[];
    callingRoutine: string = '';
    // colourPickerClosed: boolean = false;
    // colourPickerSubscription: Subscription;
    containerStyleName: string = '';
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
    errorMessage = '';
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

        // Get setup info
        this.globalVariableService.getResource('canvasBackgroundcolors')
            .then(res => {
                this.backgroundcolors = res;
                this.backgroundcolors = [
                    {id: null, name: 'No Fill', cssCode: 'transparent', shortList: false},
                    ...this.backgroundcolors
                ];
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in widget.containerStyleAdd reading canvasBackgroundcolors: ' + err);
            });

    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        // this.colourPickerSubscription.unsubscribe();
    }

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

    clickClose(action: string) {
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
            name: this.containerStyleName.trim(),
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
            containerUpdatedBy: null

        };

        this.globalVariableService.addResource('containerStyles', newContainerStyle)
            .then(res => {

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

            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in widget.containerStyleAdd adding containerStyles: ' + err);
            });
    }

}
