/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Models
import { CSScolor }                   from './models';
import { Widget }                     from './models';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

@Component({
    selector: 'shape-edit',
    templateUrl: './shape.editor.component.html',
    styleUrls: ['./shape.editor.component.css']
})
export class ShapeEditComponent implements OnInit {

    @Output() formShapeEditClosed: EventEmitter<Widget> = new EventEmitter();
    @Input() newWidget: boolean;
    @Input() selectedWidget: Widget;

    backgroundcolors: CSScolor[];
    bulletIndex: number = 0;
    bulletValue: string = '';
    editBulletItem: boolean = false;
    localWidget: Widget;                            // W to modify, copied from selected
    showArrow: boolean = false;
    showBullets: boolean = false;
    showCircle: boolean = false;
    showEllipse: boolean = false;
    showImage: boolean = false;
    showRectangle: boolean = false;
    showText: boolean = false;
    showTypeDashboard: boolean = false;
    showValue: boolean = false;


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ){}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Get setup info
        this.backgroundcolors = this.globalVariableService.backgroundcolors.slice();

        // Create new W
         if (this.newWidget) {

            // this.localWidget = Object.assign({}, this.globalVariableService.widgetTemplate);
            this.localWidget = JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplate))
            this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.
                value.currentDashboardID;
            this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.
                value.currentDashboardTabID;

            // Standard settings
            this.localWidget.widgetType = 'Shape';
            this.localWidget.containerBackgroundcolor = 'transparent';
            this.localWidget.containerBorder = 'none';
            this.localWidget.containerBorderRadius = '';
            this.localWidget.containerHasTitle = false;
            this.localWidget.containerHeight = 220;
            this.localWidget.containerWidth = 200;
            this.localWidget.shapeBullets = ["Text ..."];
            this.localWidget.shapeBulletStyleType ='square';
            this.localWidget.shapeBulletsOrdered = false;
            this.localWidget.shapeCorner = 15;
            this.localWidget.shapeFill = 'lightgray';
            this.localWidget.shapeFontFamily = 'Arial, sans serif';
            this.localWidget.shapeIsBold = true;
            this.localWidget.shapeStroke = 'black';
            this.localWidget.shapeStrokeWidth = '1';

        } else {

            // Deep copy
            this.localWidget = Object.assign({}, this.selectedWidget);

            // Refresh the form with the sub type
            this.selectShape(this.localWidget.widgetSubType);
        };

    }

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formShapeEditClosed.emit(null);
    }

    clickSelectShape(ev) {
        // The user selected a shape subtype
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectShape', '@Start');

        // Enact selected shape
        this.selectShape(ev.srcElement.value);

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
        this.showImage = false;
        this.showBullets = false;
        this.showValue = false;

        // Reset defaults, making sure localWidget exists
        if (this.localWidget) {
            this.localWidget.containerHasTitle = false;
        };

        if (shapeType == 'Circle') {
            this.showCircle = true;
        };
        if (shapeType == 'Ellipse') {
            this.showEllipse = true;
        };
        if (shapeType == 'Rectangle') {
            this.showRectangle = true;
        };
        console.log('xx this.localWidget.shapeText',this.localWidget.shapeText)
        if (shapeType == 'Text') {
            this.showText = true;
            if (this.localWidget.shapeText == null) {
                this.localWidget.shapeText = 'The brown fox is tired';
            };
        };
        if (shapeType == 'Arrow') {
            this.showArrow = true;
        };
        if (shapeType == 'Image') {
            this.showImage = true;
        };
        if (shapeType == 'Bullets') {
            this.showBullets = true;
        };
        if (shapeType == 'Value') {
            this.showValue = true;
            this.localWidget.containerHasTitle = true;
            // TODO - get this value from the DB ...
            this.localWidget.shapeText = 'R234m';
        };

    }

    clickBulletDelete(index: number, item: string) {
        // Remove item from bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBulletDelete', '@Start');

        this.localWidget.shapeBullets.splice(index,1);
        this.bulletValue = '';
        this.editBulletItem = false;
    }

    clickBulletAdd(index: number, item: string) {
        // Add item to bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBulletAdd', '@Start');

        // // TODO - this is clumsy methinks - there must be a better way
        // let tempArr: string[] = [];
        // for (var i = 0; i < this.localWidget.shapeBullets.length; i++) {

        //     if (this.localWidget.shapeBullets[i] == item) {

        //         tempArr.push(this.localWidget.shapeBullets[i]);
        //         tempArr.push('');
        //     } else {
        //         tempArr.push(this.localWidget.shapeBullets[i]);
        //     };
        // };
        // this.localWidget.shapeBullets = tempArr;
        this.bulletValue = '';
        this.editBulletItem = false;
    }

    clickBulletEdit(index: number, item: string) {
        // Edit item from bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBulletEdit', '@Start');

        this.bulletIndex = index;
        this.bulletValue = this.localWidget.shapeBullets[index];
        this.editBulletItem = true;

    }
    clickUpdate() {
        // Add item to bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEditDone', '@Start');

        this.localWidget.shapeBullets[this.bulletIndex] = this.bulletValue;
        this.editBulletItem = false;

    }
    clickAdd() {
        // Add item to bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        this.localWidget.shapeBullets.push(this.bulletValue);
    }

    clickSave() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        if (this.newWidget) {

            // TODO - improve this when using a DB!
            let newID: number = 1;
            let ws: number[]=[];
            for (var i = 0; i < this.globalVariableService.widgets.length; i++) {
                ws.push(this.globalVariableService.widgets[i].id)
            };
            if (ws.length > 0) {
                newID = Math.max(...ws) + 1;
            };
            this.localWidget.id = newID;
            this.localWidget.dashboardTabIDs.push(this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID);
            this.globalVariableService.widgets.push(this.localWidget);
            this.globalVariableService.currentWidgets.push(this.localWidget);

        } else {
            // Replace the W
            this.globalVariableService.widgetReplace(this.localWidget);
        };

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
            // TODO - make this the field name
            this.localWidget.titleText = 'Value';
        };

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
        console.log('xx this.localWidget', this.localWidget)

	  	this.formShapeEditClosed.emit(this.localWidget);
    }

}
