/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

@Component({
    selector: 'shape-edit',
    templateUrl: './shape.edit.component.html',
    styleUrls: ['./shape.edit.component.css']
})
export class ShapeEditComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formShapeEditClosed: EventEmitter<string> = new EventEmitter();

    showTextBox: boolean = true;
    showCircle: boolean = false;
    showRectangle: boolean = false;
    showLine: boolean = false;
    showArrow: boolean = false;
    showImage: boolean = false;

    showTypeDashboard: boolean = false;

    ngOnInit() {

    }

    clickClose() {
        console.log('clickClose')

		this.formShapeEditClosed.emit('cancelled');
    }

    clickSelectShape(ev) {
        console.log(ev, ev.srcElement.value)
        let shape: string = ev.srcElement.value;

        if (shape == 'TextBox') {
            this.showTextBox = true;
            this.showCircle = false;
            this.showRectangle = false;
            this.showLine = false;
            this.showArrow = false;
            this.showImage = false;
        }
        if (shape == 'Circle') {
            this.showTextBox = false;
            this.showCircle = true;
            this.showRectangle = false;
            this.showLine = false;
            this.showArrow = false;
            this.showImage = false;
        }
        if (shape == 'Rectangle') {
            this.showTextBox = false;
            this.showCircle = false;
            this.showRectangle = true;
            this.showLine = false;
            this.showArrow = false;
            this.showImage = false;
        }
        if (shape == 'Line') {
            this.showTextBox = false;
            this.showCircle = false;
            this.showRectangle = false;
            this.showLine = true;
            this.showArrow = false;
            this.showImage = false;
        }
        if (shape == 'Arrow') {
            this.showTextBox = false;
            this.showCircle = false;
            this.showRectangle = false;
            this.showLine = false;
            this.showArrow = true;
            this.showImage = false;
        }
        if (shape == 'Image') {
            this.showTextBox = false;
            this.showCircle = false;
            this.showRectangle = false;
            this.showLine = false;
            this.showArrow = false;
            this.showImage = true;
        }

    }

    clickSave() {
		this.formShapeEditClosed.emit('saved');
    }
}
