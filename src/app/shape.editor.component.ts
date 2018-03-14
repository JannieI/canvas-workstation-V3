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

        if (!this.newWidget) {
            this.selectShape('Circle');
        }

        if (this.newWidget) {

            // Create new W
            this.localWidget = this.globalVariableService.widgetTemplate;
            this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
            this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
            this.localWidget.widgetType = 'Shape';
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
        console.log('clickClose')

		this.formShapeEditClosed.emit(null);
    }

    clickSelectShape(ev) {
        // The user selected a shape subtype
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectShape', '@Start');

        console.log(ev, ev.srcElement.value)

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

        if (shapeType == 'Circle') {
            this.showCircle = true;
        }
        if (shapeType == 'Ellipse') {
            this.showEllipse = true;
        }
        if (shapeType == 'Rectangle') {
            this.showRectangle = true;
        }
        if (shapeType == 'Text') {
            this.showText = true;
        }
        if (shapeType == 'Arrow') {
            this.showArrow = true;
        }
        if (shapeType == 'Image') {
            this.showImage = true;
        }
        if (shapeType == 'Bullets') {
            this.showBullets = true;
        }
        if (shapeType == 'Value') {
            this.showValue = true;
        }

    }

    clickBulletDelete(index: number, item: string) {
        // Remove item from bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBulletDelete', '@Start');

        // TODO - fix index, somehow not working!
        this.localWidget.shapeBullets = this.localWidget.shapeBullets.filter(b => b != item);
    }

    clickBulletAdd(index: number, item: string) {
        // Add item to bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBulletAdd', '@Start');

        // TODO - fix index, somehow not working!
        // TODO - this is clumsy methinks - there must be a better way
        let tempArr: string[] = [];
        for (var i = 0; i < this.localWidget.shapeBullets.length; i++) {

            if (this.localWidget.shapeBullets[i] == item) {
                console.log('xx inside', i)
                tempArr.push(this.localWidget.shapeBullets[i]);
                tempArr.push('');
            } else {
                tempArr.push(this.localWidget.shapeBullets[i]);
            };
        };
        this.localWidget.shapeBullets = tempArr;
        this.editBulletItem = true;
    }

    clickEditDone() {
        // Add item to bullet list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEditDone', '@Start');

        // TODO - this must be done nicer
        if (this.bulletValue != '') {
            for (var i = 0; i < this.localWidget.shapeBullets.length; i++) {
                if (this.localWidget.shapeBullets[i] == '') {
                    this.localWidget.shapeBullets[i] = this.bulletValue;
                    break;
                };
            };
        } else {
            let index: number = -1;
            for (var i = 0; i < this.localWidget.shapeBullets.length; i++) {
                console.log('xx i', i)
                if (this.localWidget.shapeBullets[i] == '') {
                    index = i;
                    break;
                };
            };
            if (index >= 0) {
                this.localWidget.shapeBullets.splice(index,1);
            };
        };

        // Hide input area
        this.bulletValue = '';
        this.editBulletItem = false;

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

        // Set Shape related data
        let widgetsToRefresh: number = this.localWidget.id;

        // Tell user
        this.globalVariableService.statusBarMessage.next(
            {
                message: 'Shape Saved',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );

	  	this.formShapeEditClosed.emit(this.localWidget);
    }





}
