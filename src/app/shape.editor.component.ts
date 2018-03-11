/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

@Component({
    selector: 'shape-edit',
    templateUrl: './shape.editor.component.html',
    styleUrls: ['./shape.editor.component.css']
})
export class ShapeEditComponent implements OnInit {

    @Output() formShapeEditClosed: EventEmitter<string> = new EventEmitter();
    @Input() newWidget: boolean; 

    circleLineColor: string = 'black';
    circleLineThickness: number = 1;
    circleFillColour: string = 'steelblue';
    ellipseLineColor: string = 'black';
    ellipseLineThickness: number = 1;
    ellipseFillColour: string = 'steelblue';
    rectangleLineColor: string = 'black';
    rectangleLineThickness: number = 1;
    rectangleFillColour: string = 'steelblue';
    rectangleOpacity: number = 0.9;
    rectangleCorner: number = 15;

    shapeText: string = 'The brown fox is tired'
    shapeValue: string = 'R 234m';
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
    ){}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        if (!this.newWidget) {
            this.selectShape('Circle');
        }

    }

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');
        console.log('clickClose')

		this.formShapeEditClosed.emit('cancelled');
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

    clickSave() {
        // Save the info on the form, and return
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.formShapeEditClosed.emit('saved');
    }
}
