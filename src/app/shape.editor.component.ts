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
    templateUrl: './shape.edit.component.html',
    styleUrls: ['./shape.edit.component.css']
})
export class ShapeEditComponent implements OnInit {

    @Output() formShapeEditClosed: EventEmitter<string> = new EventEmitter();

    showCircle: boolean = false;
    showEllipse: boolean = false;
    showRectangle: boolean = false;
    showText: boolean = false;
    showArrow: boolean = false;
    showImage: boolean = false;
    showBullets: boolean = false;
    showValue: boolean = false;

    shapeText: string = 'The brown fox is tired'

    showTypeDashboard: boolean = false;

    ngOnInit() {

    }

    clickClose() {
        console.log('clickClose')

		this.formShapeEditClosed.emit('cancelled');
    }

    clickSelectShape(ev) {
        console.log(ev, ev.srcElement.value)
        
        // Get selected shape
        let shape: string = ev.srcElement.value;
        
        // Deselect all
        this.showCircle = false;
        this.showEllipse = false;
        this.showRectangle = false;
        this.showText = false;
        this.showArrow = false;
        this.showImage = false;
        this.showBullets = false;
        this.showValue = false;

        if (shape == 'Circle') {
            this.showCircle = true;
        }
        if (shape == 'Ellipse') {
            this.showEllipse = true;
        }
        if (shape == 'Rectangle') {
            this.showRectangle = true;
        }
        if (shape == 'Text') {
            this.showText = true;
        }
        if (shape == 'Arrow') {
            this.showArrow = true;
        }
        if (shape == 'Image') {
            this.showImage = true;
        }
        if (shape == 'Bullets') {
            this.showBullets = true;
        }
        if (shape == 'Value') {
            this.showValue = true;
        }

    }

    clickSave() {
		this.formShapeEditClosed.emit('saved');
    }
}
