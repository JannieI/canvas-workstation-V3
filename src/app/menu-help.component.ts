/*
 * Dashboard
 */

// From Angular
import { AfterViewInit }              from '@angular/core';
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';

// Our Services
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

// Our Models
import { Widget }                     from './models'

// Own Services

// Own Components


@Component({
    selector: 'nmenu-help',
    templateUrl: './menu-help.component.html',
    styleUrls: ['./menu-help.component.css']
})
export class MenuHelpComponent {
}