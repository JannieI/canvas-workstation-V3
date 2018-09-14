// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';

// Our models
import { CSScolor }                   from './models';
import { Widget }                     from './models'

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Other
import { Subscription }               from 'rxjs';


@Component({
    selector: 'widget-title',
    templateUrl: './widget.title.component.html',
    styleUrls: ['./widget.title.component.css']
})
export class WidgetTitleComponent implements OnInit {

    @Input() selectedWidget: Widget;
    @Output() formWidgetTitleClosed: EventEmitter<Widget> = new EventEmitter();

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
    lineColor: string = 'none';
    lineSize: string = 'none';
    localWidget: Widget;                            // W to modify, copied from selected
    oldWidget: Widget = null;                       // W at start
    selectedColour: string;


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Deconstruct border
        if (this.selectedWidget.titleBorder != ''
            &&
            this.selectedWidget.titleBorder != 'none') {
                let space: number = this.selectedWidget.titleBorder.indexOf(' ');
                if (space > 0) {
                    this.lineSize = this.selectedWidget.titleBorder.substr(0, space);
                    let rest: string = this.selectedWidget.titleBorder.substr(space + 1, 999);

                    space = rest.indexOf(' ');
                    if (space > 0) {
                        let rest: string = this.selectedWidget.titleBorder.substr(space + 1, 999);

                        space = rest.indexOf(' ');
                        if (space > 0) {
                            this.lineColor = rest.substr(space + 1, 999);
                        };
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
                        this.localWidget.titleBackgroundColor = clp.selectedColor;
                        this.localWidget.titleBackgroundColorName = 'Open Picker ...';
                    };
                    if (clp.callingRoutine == 'Colour') {
                        this.colourPickerClosed = false;
                        this.localWidget.titleColor = clp.selectedColor;
                    };
                    if (clp.callingRoutine == 'BorderColour') {
                        this.colourPickerClosed = false;
                        this.lineColor = clp.selectedColor;
                    };

                };
            };
        });

        // Deep copy original W
        this.oldWidget = JSON.parse(JSON.stringify(this.selectedWidget));

        // Deep copy Local W
        this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));

        // Get setup info
        this.backgroundcolors = this.globalVariableService.backgroundcolors.slice();
        this.backgroundcolors = [
            {id: null, name: 'Open Picker ...', cssCode: '', shortList: false}, ...this.backgroundcolors
        ];
    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        this.colourPickerSubscription.unsubscribe();
    }

    clickSelectTitleBgColor(ev: any) {
        // Select Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTitleBgColor', '@Start');

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectTitleBgColorPicker(null);
        };
        // this.localWidget.titleBackgroundColor = ev.target.value;

        this.localWidget.titleBackgroundColorName = ev.target.value;
        this.localWidget.titleBackgroundColor = this.localWidget.titleBackgroundColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.titleBackgroundColorName
        );
        if (localIndex >= 0) {
            this.localWidget.titleBackgroundColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectTitleBgColorPicker(ev: any) {
        // Open the Colour Picker for Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTitleBgColorPicker', '@Start');

        this.selectedColour = this.localWidget.titleBackgroundColor;
        this.callingRoutine = 'BgColour';
        this.colourPickerClosed = true;
    }

    clickSelectColor(ev: any) {
        // Select text Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectColor', '@Start');

        this.localWidget.titleColor = ev.target.value;
    }

    clickSelectColorPicker(ev: any) {
        // Open the Colour Picker for text Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectColorPicker', '@Start');

        this.selectedColour = this.localWidget.titleColor;
        this.callingRoutine = 'Colour';
        this.colourPickerClosed = true;
    }

    clickSelectBorderColor(ev: any) {
        // Select text Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectColor', '@Start');

        this.lineColor = ev.target.value;
    }

    clickSelectBorderColorPicker(ev: any) {
        // Open the Colour Picker for text Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectColorPicker', '@Start');

        this.selectedColour = this.lineColor;
        this.callingRoutine = 'BorderColour';
        this.colourPickerClosed = true;
    }

    clickSelectLineSize(ev: any) {
        // Select Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLineSize', '@Start');

        this.lineSize = ev.target.value;

        // Construct line size
        if (this.lineSize != 'none') {
            this.localWidget.titleBorder = this.lineSize + ' solid ' + this.lineColor;
        };
    }

  	clickClose() {
        // Close the form, no action
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

  	  	this.formWidgetTitleClosed.emit(null);
    }

    clickSave() {
        // Save and close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');
        console.warn('xx b col', this.lineColor, this.lineSize, this.localWidget.titleBorder)

        // Construct title Border
        if (this.lineSize != 'none') {
            this.localWidget.titleBorder = this.lineSize + ' solid ' + this.lineColor;
            console.warn('xx b col 2', this.localWidget.titleBorder)
        } else {
            this.localWidget.titleBorder = this.lineSize
        };

        this.globalVariableService.saveWidget(this.localWidget).then(res => {
            // Action
            // TODO - cater for errors + make more generic
            let actID: number = this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                this.localWidget.id,
                'Widget',
                'Edit',
                'Update Title',
                'W Title clickSave',
                null,
                null,
                this.oldWidget,
                this.localWidget,
                false               // Dont log to DB yet
            );

            // Tell user
            this.globalVariableService.showStatusBarMessage(
                {
                    message: 'Slicer Saved',
                    uiArea: 'StatusBar',
                    classfication: 'Info',
                    timeout: 3000,
                    defaultMessage: ''
                }
            );
        });

        this.formWidgetTitleClosed.emit(this.localWidget);
    }
  }