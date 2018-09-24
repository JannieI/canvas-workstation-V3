/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Components

// Our Models
import { CSScolor }                   from './models';
import { Widget }                     from './models';
import { WidgetLayout }               from './models';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Other
import { Subscription }               from 'rxjs';


@Component({
    selector: 'shape-edit',
    templateUrl: './shape.editor.component.html',
    styleUrls: ['./shape.editor.component.css']
})
export class ShapeEditComponent implements OnInit {

    @Input() selectedWidgetLayout: WidgetLayout;
    @Input() selectedWidget: Widget;
    @Input() newWidget: boolean;

    @Output() formShapeEditClosed: EventEmitter<Widget> = new EventEmitter();

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
               if (this.editLineNr == -1) {
                   this.clickSave();
                   return;
                } else {
                    this.editLineNr = -1;
                };
        };

    }

    backgroundcolors: CSScolor[];
    bulletIndex: number = 0;                    // Index (position) in [w.Bullets]
    bulletSelectedTab: string = 'None';         // Clicked on Bullets -> Tabname (sequence nr)
    bulletText: string = '';                    // Clicked on Bullets -> Bullet Text
    callingRoutine: string = '';
    colourPickerClosed: boolean = false;
    colourPickerSubscription: Subscription;
    dashboardTabList: string[];
    hasAutoFocusCircle: boolean = false;
    hasAutoFocusEllipse: boolean = false;
    hasAutoFocusRectangle: boolean = false;
    hasAutoFocusText: boolean = false;
    hasAutoFocusArrow: boolean = false;
    hasAutoFocusArrowThin: boolean = false;
    hasAutoFocusImage: boolean = false;
    hasAutoFocusBullets: boolean = false;
    hasAutoFocusValue: boolean = false;
    hasAutoFocusBrackets: boolean = false;
    editLineNr: number = -1;
    localWidget: Widget;                            // W to modify, copied from selected
    oldText: string = '';
    oldWidget: Widget = null;                       // W at start
    selectedColour: string;
    selectedTabIndex: number;
    showArrow: boolean = false;
    showArrowThin: boolean = false;
    showBullets: boolean = false;
    showCircle: boolean = false;
    showEllipse: boolean = false;
    showImage: boolean = false;
    showRectangle: boolean = false;
    showText: boolean = false;
    showTypeDashboard: boolean = false;
    showValue: boolean = false;
    showBrackets: boolean = false;


    arrowLine: string = "M10,10 L150,10";

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ){}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
        
        // Manage colour picker
        this.colourPickerSubscription = this.globalVariableService.colourPickerClosed.subscribe(clp => {

            if (this.localWidget != undefined  &&  clp != null) {

                if (clp.cancelled) {
                    this.colourPickerClosed = false;
                } else {

                    if (clp.callingRoutine == 'ShapeEditorTextColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeTextColour = clp.selectedColor;
                        this.localWidget.shapeTextColourName = 'Open Picker ...';
                    };

                    if (clp.callingRoutine == 'ShapeEditorBracketColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeStroke = clp.selectedColor;
                        this.localWidget.shapeStrokeName = 'Open Picker ...';
                    };

                    if (clp.callingRoutine == 'ShapeEditorCircleLineColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeStroke = clp.selectedColor;
                        this.localWidget.shapeStrokeName = 'Open Picker ...';
                    };
                    if (clp.callingRoutine == 'ShapeEditorCircleFillColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeFill = clp.selectedColor;
                        this.localWidget.shapeFillName = 'Open Picker ...';
                    };

                    if (clp.callingRoutine == 'ShapeEditorEllipseLineColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeStroke = clp.selectedColor;
                        this.localWidget.shapeStrokeName = 'Open Picker ...';
                    };
                    if (clp.callingRoutine == 'ShapeEditorEllipseFillColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeFill = clp.selectedColor;
                        this.localWidget.shapeFillName = 'Open Picker ...';
                    };

                    if (clp.callingRoutine == 'ShapeEditorRectangleLineColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeStroke = clp.selectedColor;
                        this.localWidget.shapeStrokeName = 'Open Picker ...';
                    };
                    if (clp.callingRoutine == 'ShapeEditorRectangleFillColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeFill = clp.selectedColor;
                        this.localWidget.shapeFillName = 'Open Picker ...';
                    };

                    if (clp.callingRoutine == 'ShapeEditorValueLineColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeTextColour = clp.selectedColor;
                        this.localWidget.shapeTextColourName = 'Open Picker ...';
                    };

                    if (clp.callingRoutine == 'ShapeEditorBulletsColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeTextColour = clp.selectedColor;
                        this.localWidget.shapeTextColourName = 'Open Picker ...';
                    };

                    if (clp.callingRoutine == 'ShapeEditorArrowLineColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeStroke = clp.selectedColor;
                        this.localWidget.shapeStrokeName = 'Open Picker ...';
                    };

                    if (clp.callingRoutine == 'ShapeEditorArrowFillColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeFill = clp.selectedColor;
                        this.localWidget.shapeFillName = 'Open Picker ...';
                    };

                    if (clp.callingRoutine == 'ShapeEditorArrowThinColor') {
                        this.colourPickerClosed = false;
                        this.localWidget.shapeStroke = clp.selectedColor;
                        this.localWidget.shapeStrokeName = 'Open Picker ...';
                    };

                };
            };
        });

        // Get setup info
        this.backgroundcolors = this.globalVariableService.backgroundcolors.slice();
        this.backgroundcolors = [
            {id: null, name: 'Open Picker ...', cssCode: '', shortList: false}, ...this.backgroundcolors
        ];

        // Create list of Tabs to show: first is 'None', rest is name (sequence nr),
        //   where sequence nr = index + 1 - to look easier for user, 1 = 1st tab, etc
        this.dashboardTabList = ['None'];
        for (var i = 0; i < this.globalVariableService.currentDashboardTabs.length; i++) {
            this.dashboardTabList.push(
                this.globalVariableService.currentDashboardTabs[i].name
                    + ' (' + (i + 1).toString() + ')');
        };

        // Create new W
         if (this.newWidget) {

            this.localWidget = JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplate))
            this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.
                value.currentDashboardID;
            this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.
                value.currentDashboardTabID;

            // Standard settings
            this.localWidget.widgetType = 'Shape';
            this.localWidget.containerBackgroundcolor = 'transparent';
            this.localWidget.containerBackgroundcolorName = 'Transparent';
            this.localWidget.containerBorder = 'none';
            this.localWidget.containerBorderRadius = '';
            this.localWidget.containerHasContextMenus = false;
            this.localWidget.containerHasTitle = false;
            this.localWidget.containerHeight = 220;
            this.localWidget.containerWidth = 200;
            this.localWidget.shapeBullet = [];
            this.localWidget.shapeBulletStyleType ='square';
            this.localWidget.shapeBulletsOrdered = false;
            this.localWidget.shapeCorner = 15;
            this.localWidget.shapeFill = 'gray';
            this.localWidget.shapeFill = 'Gray';
            this.localWidget.shapeFontFamily = 'Arial, sans serif';
            this.localWidget.shapeIsBold = true;
            this.localWidget.shapeStroke = 'gray';
            this.localWidget.shapeStroke = 'Gray';
            this.localWidget.shapeStrokeWidth = '1';
            this.localWidget.shapeSvgHeight = 60;
            this.localWidget.shapeSvgWidth = 60;
            this.localWidget.shapeText = 'Enter text, keywords: #pagenr, #pages, #date';
            this.localWidget.shapeTextColour = 'gray';
            this.localWidget.shapeTextColourName = 'Gray';
            this.localWidget.shapeTextAlign = 'Left';

        } else {

            // Deep copy original W
            this.oldWidget = JSON.parse(JSON.stringify(this.selectedWidget));

            // Deep copy Local W
            this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));
            
            // Refresh the form with the sub type
            this.selectShape(this.localWidget.widgetSubType);

            // Set AutoFocus
            // TODO - this only works for the first Shape opened - and I dont want to use
            // ngAfterViewInit or event emitters.  See this for possible solution:
            //    https://stackoverflow.com/questions/41873893/angular2-autofocus-input-element
            this.hasAutoFocusCircle = false;
            this.hasAutoFocusEllipse = false;
            this.hasAutoFocusRectangle = false;
            this.hasAutoFocusText = false;
            this.hasAutoFocusArrow = false;
            this.hasAutoFocusArrowThin = false;
            this.hasAutoFocusImage = false;
            this.hasAutoFocusBullets = false;
            this.selectedColour = this.localWidget.shapeTextColour;
            this.hasAutoFocusValue = false;
            this.hasAutoFocusBrackets = false;

            if (this.localWidget.widgetSubType == 'Circle') {
                this.hasAutoFocusCircle = true;
            };
            if (this.localWidget.widgetSubType == 'Ellipse') {
                this.hasAutoFocusEllipse = true;
            };
            if (this.localWidget.widgetSubType == 'Rectangle') {
                this.hasAutoFocusRectangle = true;
            };
            if (this.localWidget.widgetSubType == 'Text') {
                this.hasAutoFocusText = true;
            };
            if (this.localWidget.widgetSubType == 'Arrow') {
                this.hasAutoFocusArrow = true;
            };
            if (this.localWidget.widgetSubType == 'ArrowThin') {
                this.hasAutoFocusArrowThin = true;
            };
            if (this.localWidget.widgetSubType == 'Image') {
                this.hasAutoFocusImage = true;
            };
            if (this.localWidget.widgetSubType == 'Bullets') {
                this.hasAutoFocusBullets = true;
            };
            if (this.localWidget.widgetSubType == 'Value') {
                this.hasAutoFocusValue = true;
            };
            if (this.localWidget.widgetSubType == 'Brackets') {
                this.hasAutoFocusBrackets = true;
            };

        };

    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        this.colourPickerSubscription.unsubscribe();
    }

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formShapeEditClosed.emit(null);
    }

    clickTextStringClear() {
        // Clear the Text string
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTextStringClear', '@Start');

        this.localWidget.shapeText = '';
    }

    clickSelectShape(ev) {
        // The user selected a shape subtype
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectShape', '@Start');

        let selectedShape: string = ev.srcElement.value;

        // Set AutoFocus
        this.hasAutoFocusCircle = false;
        this.hasAutoFocusEllipse = false;
        this.hasAutoFocusRectangle = false;
        this.hasAutoFocusText = false;
        this.hasAutoFocusArrow = false;
        this.hasAutoFocusArrowThin = false;
        this.hasAutoFocusImage = false;
        this.hasAutoFocusBullets = false;
        this.hasAutoFocusValue = false;
        this.hasAutoFocusBrackets = false;

        if (selectedShape == 'Circle') {
            this.hasAutoFocusCircle = true;
        };
        if (selectedShape == 'Ellipse') {
            this.hasAutoFocusEllipse = true;
        };
        if (selectedShape == 'Rectangle') {
            this.hasAutoFocusRectangle = true;
        };
        if (selectedShape == 'Text') {
            this.hasAutoFocusText = true;
        };
        if (selectedShape == 'Arrow') {
            this.hasAutoFocusArrow = true;
        };
        if (selectedShape == 'ArrowThin') {
            this.hasAutoFocusArrowThin = true;
        };
        if (selectedShape == 'Image') {
            this.hasAutoFocusImage = true;
        };
        if (selectedShape == 'Bullets') {
            this.hasAutoFocusBullets = true;
        };
        if (selectedShape == 'Value') {
            this.hasAutoFocusValue = true;
        };
        if (selectedShape == 'Brackets') {
            this.hasAutoFocusBrackets = true;
        };

        // Enact selected shape
        this.selectShape(selectedShape);

    }

    selectShape(shapeType: string) {
        // Change form according to the selected a shape subtype
        this.globalFunctionService.printToConsole(this.constructor.name,'selectShape', '@Start');

        // Deselect all
        this.showCircle = false;
        this.showEllipse = false;
        this.showRectangle = false;
        this.showText = false;
        this.showArrow = false;
        this.showArrowThin = false;
        this.showImage = false;
        this.showBullets = false;
        this.showValue = false;
        this.showBrackets = false;

        if (shapeType == 'Circle') {
            this.showCircle = true;
        };
        if (shapeType == 'Ellipse') {
            this.showEllipse = true;
        };
        if (shapeType == 'Rectangle') {
            this.showRectangle = true;
        };

        if (shapeType == 'Text') {
            this.showText = true;
            if (this.localWidget.shapeText == null) {
                this.localWidget.shapeText = 'Enter text, keywords: #pagenr, #pages, #date';
            };
        };
        if (shapeType == 'Arrow') {
            this.showArrow = true;
        };
        if (shapeType == 'ArrowThin') {
            this.showArrowThin = true;
        };
        if (shapeType == 'Image') {
            this.showImage = true;
        };
        if (shapeType == 'Bullets') {
            this.showBullets = true;
        };
        if (shapeType == 'Value') {
            this.showValue = true;
            this.localWidget.shapeText = 'R234m';
        };
        if (shapeType == 'Brackets') {
            this.showBrackets = true;
        };

    }

    dblclickBulletDelete(index: number, item: string) {
        // Remove item from bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickBulletDelete', '@Start');

        this.localWidget.shapeBullet.splice(index,1);
        this.bulletText = '';

    }

    clickBulletTextEdit(index: number, text: string) {
        // Set row nr in bullet list to edit
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBulletTextEdit', '@Start');

        // Remember old content, in case we roll back
        this.oldText = text;

        // Set the linked dropdown
        if (this.localWidget.shapeBullet[index].linkedTabID == null) {
            this.bulletSelectedTab = 'None';
        } else {
            let tID: number = this.localWidget.shapeBullet[index].linkedTabID;
            let gvIndex: number = this.globalVariableService.currentDashboardTabs.findIndex(t =>
                t.id == tID);

            // If this ID exists, show it with the correct sequence number (index + 1)
            if (gvIndex == -1) {
                this.bulletSelectedTab = 'None';
            } else {

                this.bulletSelectedTab = this.globalVariableService.currentDashboardTabs
                    [gvIndex].name + ' (' + (gvIndex + 1).toString() + ')';
            };
        };

        // Set line to Edit
        this.editLineNr = index;

    }

    clickBulletEditCancel(index: number) {
        // Save Edited item from bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBulletEditCancel', '@Start');

        // Reset text
        this.localWidget.shapeBullet[index].text = this.oldText;

        // Stop editing
        this.editLineNr = -1;

    }

    clickBulletEditSave(index: number) {
        // Save Edited item from bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBulletEditSave', '@Start');

        // None selected
        if (this.bulletSelectedTab == 'None') {
            this.localWidget.shapeBullet[index].linkedTabID = null;
        } else {
            // Get sequence nr = index + 1
            let openBracket: number = this.bulletSelectedTab.indexOf('(');
            let closeBracket: number = this.bulletSelectedTab.indexOf(')');
            let tabSequenceNr = +this.bulletSelectedTab.substring(openBracket + 1, closeBracket);

            // Store ID associated with that sequence nr
            if (tabSequenceNr < 0) {
                this.localWidget.shapeBullet[index].linkedTabID = null;
            } else {
                this.localWidget.shapeBullet[index].linkedTabID =
                    this.globalVariableService.currentDashboardTabs[tabSequenceNr - 1].id;
            };

            // // Store bullet text
            // this.localWidget.shapeBullet[index].text = this.bulletText;
        };

        // Stop editing
        this.editLineNr = -1;

    }

    clickBulletAdd() {
        // Add item to bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBulletAdd', '@Start');

        // Remove dummy 'Text' string
        if (this.localWidget.shapeBullet.length == 1) {
            if (this.localWidget.shapeBullet[0].text == 'Text ...') {
                this.localWidget.shapeBullet = [];
            };
        };

        // Add to Bullets
        this.localWidget.shapeBullet.push(
            {
                text: this.bulletText,
                linkedTabID: null,
                color: '',
                jumpedColor: ''
            }
        );

        // Reset
        this.bulletText = '';
    }

    clickSelectBulletsTab(ev: any) {
        // Add the TabID to the Bullets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBulletsTab', '@Start');

        // Get T info
        let selectedTabstring: string = ev.target.value;
        let openBracket: number = selectedTabstring.indexOf('(');
        let closeBracket: number = selectedTabstring.indexOf(')');
        this.selectedTabIndex = +selectedTabstring.substring(openBracket + 1, closeBracket);

    }

    clickSave() {
        // Save the Shape, globally and to DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Special settings
        if (this.localWidget.widgetSubType == 'Circle') {
            this.localWidget.containerHeight = this.localWidget.containerWidth;
        };
        if (this.localWidget.widgetSubType == 'Ellipse') {
            this.localWidget.containerHeight = 100;
            this.localWidget.containerWidth = this.localWidget.containerHeight * 2;
        };
        if (this.localWidget.widgetSubType == 'Value') {
            this.localWidget.containerBorder = '1px solid gray';
            this.localWidget.containerBorderRadius = '5px';
            this.localWidget.containerHeight = 80;
            this.localWidget.titleBackgroundColor = 'transparent';
            this.localWidget.titleBackgroundColorName = 'transparent';
            // TODO - make this the field name
            this.localWidget.titleText = 'Value';
        };

        // Replace keywords in the text
        this.localWidget.shapeTextDisplay =
            this.globalVariableService.calcShapeTextDisplay(this.localWidget.shapeText);

        if (this.newWidget) {

            // Populate predefined dimensions
            if (this.selectedWidgetLayout.id != null
                &&
                this.selectedWidgetLayout.id != undefined) {

                this.localWidget.containerLeft = this.selectedWidgetLayout.left;
                this.localWidget.containerHeight = this.selectedWidgetLayout.height;
                this.localWidget.containerTop = this.selectedWidgetLayout.top;
                this.localWidget.containerWidth = this.selectedWidgetLayout.width;
            } else {

                // Estimate size of Bullets
                if (this.localWidget.widgetSubType == 'Bullets') {
                    let maxTextLength: number = 3;
                    let nrLines: number = this.localWidget.shapeBullet.length;
                    this.localWidget.shapeBullet.forEach(sb => {
                        if (sb.text.length > maxTextLength) {
                            maxTextLength = sb.text.length;
                        };
                        if (maxTextLength > 50) {
                            maxTextLength = 50;
                            nrLines = nrLines + 1;
                        };
                    });

                    this.localWidget.containerWidth = 35 + (maxTextLength
                        * this.localWidget.shapeFontSize / 2);
                    this.localWidget.containerHeight = +nrLines *
                        (8 + +this.localWidget.shapeFontSize);

                };

                // Set calculated start Width and Height for Text
                if (this.localWidget.widgetSubType == 'Text') {
                    this.localWidget.containerWidth = this.localWidget.shapeTextDisplay.length
                        * this.localWidget.shapeFontSize / 2;
                    this.localWidget.containerHeight = 8 + +this.localWidget.shapeFontSize;
                };

            };

            this.localWidget.dashboardTabIDs.push(
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID
            );

            this.globalVariableService.addWidget(this.localWidget).then(res => {

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
                    null,
                    this.localWidget,
                    false               // Dont log to DB yet
                );

                this.localWidget.id = res.id;

                // Tell user
                this.globalVariableService.showStatusBarMessage(
                    {
                        message: 'Shape Added',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                this.formShapeEditClosed.emit(this.localWidget);
            });

        } else {
            // Replace the W
            this.globalVariableService.widgetReplace(this.localWidget);

            // Update global W and DB
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
                        message: 'Shape Saved',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                this.formShapeEditClosed.emit(this.localWidget);
            });
        };

    }

    clickSelectBracketLineColor(ev: any) {
        // Select Bracket Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBracketLineColor', '@Start');

        // this.localWidget.shapeStroke = ev.target.value;

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectBracketLineColorPicker();
        };

        this.localWidget.shapeStrokeName = ev.target.value;
        this.localWidget.shapeStroke = this.localWidget.shapeStrokeName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.shapeStrokeName
        );
        if (localIndex >= 0) {
            this.localWidget.shapeStroke = this.backgroundcolors[localIndex].cssCode;
        };

    }

    clickSelectBracketLineColorPicker() {
        // Open the Colour Picker for Bracket Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBracketLineColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorBracketColor';
        this.colourPickerClosed = true;
    }

    clickSelectTextAlign(ev: any) {
        // Select Text Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTextAlign', '@Start');

        this.localWidget.shapeTextAlign = ev.target.value;
    }

    clickSelectTextColor(ev: any) {
        // Select Text Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTextColor', '@Start');

        // this.localWidget.shapeTextColour = ev.target.value;

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectTextColorPicker();
        };

        this.localWidget.shapeTextColourName = ev.target.value;
        this.localWidget.shapeTextColour = this.localWidget.shapeTextColourName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.shapeTextColourName
        );
        if (localIndex >= 0) {
            this.localWidget.shapeTextColour = this.backgroundcolors[localIndex].cssCode;
        };

    }

    clickSelectTextColorPicker() {
        // Open the Colour Picker for Text Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTextColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeTextColour;
        this.callingRoutine = 'ShapeEditorTextColor';
        this.colourPickerClosed = true;
    }

    clickSelectCircleLineColor(ev: any) {
        // Select Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectCircleLineColor', '@Start');

        // this.localWidget.shapeStroke = ev.target.value;

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectCircleLineColorPicker(null);
        };

        this.localWidget.shapeStrokeName = ev.target.value;
        this.localWidget.shapeStroke = this.localWidget.shapeStrokeName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.shapeStrokeName
        );
        if (localIndex >= 0) {
            this.localWidget.shapeStroke = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectCircleLineColorPicker(ev: any) {
        // Open the Colour Picker for Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectCircleLineColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorCircleLineColor';
        this.colourPickerClosed = true;
    }

    clickSelectCircleFillColor(ev: any) {
        // Select Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectCircleFillColor', '@Start');

        // this.localWidget.shapeFill = ev.target.value;

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectCircleFillColorPicker(null);
        };

        this.localWidget.shapeFillName = ev.target.value;
        this.localWidget.shapeFill = this.localWidget.shapeFillName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.shapeFillName
        );
        if (localIndex >= 0) {
            this.localWidget.shapeFill = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectCircleFillColorPicker(ev: any) {
        // Open the Colour Picker for Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectCircleFillColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorCircleFillColor';
        this.colourPickerClosed = true;
    }

    clickSelectEllipseLineColor(ev: any) {
        // Select Ellipse Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectEllipseLineColor', '@Start');

        // this.localWidget.shapeStroke = ev.target.value;

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectEllipseLineColorPicker(null);
        };

        this.localWidget.shapeStrokeName = ev.target.value;
        this.localWidget.shapeStroke = this.localWidget.shapeStrokeName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.shapeStrokeName
        );
        if (localIndex >= 0) {
            this.localWidget.shapeStroke = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectEllipseLineColorPicker(ev: any) {
        // Open the Colour Picker for Ellipse Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectEllipseLineColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorEllipseLineColor';
        this.colourPickerClosed = true;
    }

    clickSelectEllipseFillColor(ev: any) {
        // Select Ellipse Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectEllipseFillColor', '@Start');

        // this.localWidget.shapeFill = ev.target.value;

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectEllipseFillColorPicker(null);
        };

        this.localWidget.shapeFillName = ev.target.value;
        this.localWidget.shapeFill = this.localWidget.shapeFillName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.shapeFillName
        );
        if (localIndex >= 0) {
            this.localWidget.shapeFill = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectEllipseFillColorPicker(ev: any) {
        // Open the Colour Picker for Ellipse Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectEllipseFillColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorEllipseFillColor';
        this.colourPickerClosed = true;
    }

    clickSelectRectangleLineColor(ev: any) {
        // Select Rectangle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectRectangleLineColor', '@Start');

        // this.localWidget.shapeStroke = ev.target.value;

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectRectangleLineColorPicker(null);
        };

        this.localWidget.shapeStrokeName = ev.target.value;
        this.localWidget.shapeStroke = this.localWidget.shapeStrokeName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.shapeStrokeName
        );
        if (localIndex >= 0) {
            this.localWidget.shapeStroke = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectRectangleLineColorPicker(ev: any) {
        // Open the Colour Picker for Rectangle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectRectangleLineColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorRectangleLineColor';
        this.colourPickerClosed = true;
    }

    clickSelectRectangleFillColor(ev: any) {
        // Select Rectangle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectRectangleFillColor', '@Start');

        // this.localWidget.shapeFill = ev.target.value;

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectRectangleLineColorPicker(null);
        };

        this.localWidget.shapeFillName = ev.target.value;
        this.localWidget.shapeFill = this.localWidget.shapeFillName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.shapeFillName
        );
        if (localIndex >= 0) {
            this.localWidget.shapeFill = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectRectangleFillColorPicker(ev: any) {
        // Open the Colour Picker for Rectangle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectRectangleFillColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorRectangleFillColor';
        this.colourPickerClosed = true;
    }

    clickSelectValueLineColor(ev: any) {
        // Select Value Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectValueLineColor', '@Start');

        // this.localWidget.shapeTextColour = ev.target.value;

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectValueLineColorPicker(null);
        };

        this.localWidget.shapeTextColourName = ev.target.value;
        this.localWidget.shapeTextColour = this.localWidget.shapeTextColourName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.shapeTextColourName
        );
        if (localIndex >= 0) {
            this.localWidget.shapeTextColour = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectValueLineColorPicker(ev: any) {
        // Open the Colour Picker for Value Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectValueLineColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorValueLineColor';
        this.colourPickerClosed = true;
    }

    clickSelectBulletsColor(ev: any) {
        // Select Bullets Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBulletsColor', '@Start');

        // this.localWidget.shapeTextColour = ev.target.value;

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectBulletsColorPicker();
        };

        this.localWidget.shapeTextColourName = ev.target.value;
        this.localWidget.shapeTextColour = this.localWidget.shapeTextColourName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.shapeTextColourName
        );
        if (localIndex >= 0) {
            this.localWidget.shapeTextColour = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectBulletsColorPicker() {
        // Open the Colour Picker for Bullets Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBulletsColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeTextColour;
        this.callingRoutine = 'ShapeEditorBulletsColor';
        this.colourPickerClosed = true;
    }

    clickSelectBulletsIncrease() {
        // Increase the space between bullet points
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBulletsIncrease', '@Start');

        this.localWidget.shapeBulletMarginBottom = this.localWidget.shapeBulletMarginBottom + 3;

    }

    clickSelectBulletsDecrease() {
        // Decrease the space between bullet points
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBulletsDecrease', '@Start');

        if (this.localWidget.shapeBulletMarginBottom >= 3) {
            this.localWidget.shapeBulletMarginBottom =
                this.localWidget.shapeBulletMarginBottom - 3;
        };
    }

    clickSelectBulletsMarker(ev: any) {
        // Select Bullet Marker
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBulletsMarker', '@Start');

        this.localWidget.shapeBulletStyleType = ev.target.value;
    }

    clickSelectBracketSize(ev: any) {
        // Select Arrow Size
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBracketSize', '@Start');

        this.localWidget.shapeSize = ev.target.value;
        this.localWidget.shapeSvgHeight = 60; //((this.localWidget.shapeSize - 1) * 22.5 ) + 40;
        this.localWidget.shapeSvgWidth = 60;  //((this.localWidget.shapeSize - 1) * 22.5 ) + 40;
    }

    clickSelectArrowSize(ev: any) {
        // Select Arrow Size
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectArrowSize', '@Start');

        this.localWidget.shapeSize = ev.target.value;
        this.localWidget.shapeSvgHeight = 60; //((this.localWidget.shapeSize - 1) * 22.5 ) + 40;
        this.localWidget.shapeSvgWidth = 60;  //((this.localWidget.shapeSize - 1) * 22.5 ) + 40;
    }

    clickSelectArrowLineColor(ev: any) {
        // Select Arrow Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectArrowLineColor', '@Start');

        // this.localWidget.shapeStroke = ev.target.value;

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectArrowLineColorPicker(null);
        };

        this.localWidget.shapeStrokeName = ev.target.value;
        this.localWidget.shapeStroke = this.localWidget.shapeStrokeName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.shapeStrokeName
        );
        if (localIndex >= 0) {
            this.localWidget.shapeStroke = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectArrowLineColorPicker(ev: any) {
        // Open the Colour Picker for Arrow Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectArrowLineColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorArrowLineColor';
        this.colourPickerClosed = true;
    }

    clickSelectArrowFill(ev: any) {
        // Select Arrow Fill Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectArrowFill', '@Start');

        // this.localWidget.shapeFill = ev.target.value;

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectArrowFillColorPicker(null);
        };

        this.localWidget.shapeFillName = ev.target.value;
        this.localWidget.shapeFill = this.localWidget.shapeFillName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.shapeFillName
        );
        if (localIndex >= 0) {
            this.localWidget.shapeFill = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectArrowFillColorPicker(ev: any) {
        // Open the Colour Picker for Arrow Fill Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectArrowFillColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeFill;
        this.callingRoutine = 'ShapeEditorArrowFillColor';
        this.colourPickerClosed = true;
    }

    clickSelectArrowThinColor(ev: any) {
        // Select Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectArrowThinColor', '@Start');

        // this.localWidget.shapeStroke = ev.target.value;

        // Open Picker if selected
        if (ev.target.value == 'Open Picker ...') {
            this.clickSelectArrowThinColorPicker(null);
        };

        this.localWidget.shapeStrokeName = ev.target.value;
        this.localWidget.shapeStroke = this.localWidget.shapeStrokeName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.shapeStrokeName
        );
        if (localIndex >= 0) {
            this.localWidget.shapeStroke = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectArrowThinColorPicker(ev: any) {
        // Open the Colour Picker for Circle Line Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectArrowThinColorPicker', '@Start');

        this.selectedColour = this.localWidget.shapeStroke;
        this.callingRoutine = 'ShapeEditorArrowThinColor';
        this.colourPickerClosed = true;
    }

    mousedownArrow(ev: any) {
        // Toggles Palette - horisontal / vertical
        this.globalFunctionService.printToConsole(this.constructor.name,'mousedownArrow', '@Start');

        // Store X & Y
        console.warn('xx ', ev.x, ev.y)

    }

    mouseupArrow(ev: any) {
        // Toggles Palette - horisontal / vertical
        this.globalFunctionService.printToConsole(this.constructor.name,'mouseupArrow', '@Start');

        console.warn('xx ', ev.x, ev.y)
    }
}

