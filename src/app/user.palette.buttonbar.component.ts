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

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { DashboardTag }               from './models';
import { ButtonBarAvailable}          from './models'
import { ButtonBarSelected }          from './models';
import { Dashboard }                  from './models';
import { PaletteButtonBar }           from './models';
import { UserPaletteButtonBar }       from './models';
import { WidgetCheckpointsComponent } from 'app/widget.checkpoints.component';

const paletteButtons = [
    {
        id: 1,
        mainmenuItem: "Edit",
        menuText: "Undo",
        shape: "pencil",
        size: "20",
        class: "buttonBarIcon",
        backgroundColor: "rgb(223, 223, 171)",
        accesskey: "w",
        sortOrder: 1,
        isDefault: true,
        functionName: "clickMenuEditUndo",
        params: "",
        tooltipContent: "Undo a previous action"
    },
    {
        id: 2,
        mainmenuItem: "Dashboard",
        menuText: "Edit All",
        shape: "download",
        size: "20",
        class: "buttonBarIcon",
        backgroundColor: "rgb(224, 177, 150)",
        accesskey: "w",
        sortOrder: 1,
        isDefault: true,
        functionName: "clickMenuEditSelectAllNone",
        params: "Auto",
        tooltipContent: "Selected/Unselect Widgets"
    },
    {
        id: 3,
        mainmenuItem: "Data",
        menuText: "Edit All",
        shape: "download",
        size: "20",
        class: "buttonBarIcon",
        backgroundColor: "rgb(180, 233, 120)",
        accesskey: "w",
        sortOrder: 1,
        isDefault: true,
        functionName: "clickMenuEditSelectAllNone",
        params: "Auto",
        tooltipContent: "Selected/Unselect Widgets"
    },
    {
        id: 4,
        mainmenuItem: "Widget",
        menuText: "Edit All",
        shape: "download",
        size: "20",
        class: "buttonBarIcon",
        backgroundColor: "rgb(160, 248, 182)",
        accesskey: "w",
        sortOrder: 1,
        isDefault: true,
        functionName: "clickMenuEditSelectAllNone",
        params: "Auto",
        tooltipContent: "Selected/Unselect Widgets"
    },
    {
        id: 5,
        mainmenuItem: "Table",
        menuText: "Edit All",
        shape: "download",
        size: "20",
        class: "buttonBarIcon",
        backgroundColor: "rgb(127, 241, 226)",
        accesskey: "w",
        sortOrder: 1,
        isDefault: true,
        functionName: "clickMenuEditSelectAllNone",
        params: "Auto",
        tooltipContent: "Selected/Unselect Widgets"
    },
    {
        id: 6,
        mainmenuItem: "Slicer",
        menuText: "Edit All",
        shape: "download",
        size: "20",
        class: "buttonBarIcon",
        backgroundColor: "rgb(161, 203, 250)",
        accesskey: "w",
        sortOrder: 1,
        isDefault: true,
        functionName: "clickMenuEditSelectAllNone",
        params: "Auto",
        tooltipContent: "Selected/Unselect Widgets"
    },
    {
        id: 7,
        mainmenuItem: "Shape",
        menuText: "Edit All",
        shape: "download",
        size: "20",
        class: "buttonBarIcon",
        backgroundColor: "rgb(189, 180, 241)",
        accesskey: "w",
        sortOrder: 1,
        isDefault: true,
        functionName: "clickMenuEditSelectAllNone",
        params: "Auto",
        tooltipContent: "Selected/Unselect Widgets"
    },
    {
        id: 8,
        mainmenuItem: "View",
        menuText: "Edit All",
        shape: "download",
        size: "20",
        class: "buttonBarIcon",
        backgroundColor: "rgb(233, 223, 236)",
        accesskey: "w",
        sortOrder: 1,
        isDefault: true,
        functionName: "clickMenuEditSelectAllNone",
        params: "Auto",
        tooltipContent: "Selected/Unselect Widgets"
    },
    {
        id: 9,
        mainmenuItem: "Arrange",
        menuText: "Edit All",
        shape: "download",
        size: "20",
        class: "buttonBarIcon",
        backgroundColor: "rgb(207, 171, 188)",
        accesskey: "w",
        sortOrder: 1,
        isDefault: true,
        functionName: "clickMenuEditSelectAllNone",
        params: "Auto",
        tooltipContent: "Selected/Unselect Widgets"
    },
    {
        id: 10,
        mainmenuItem: "Help",
        menuText: "Edit All",
        shape: "download",
        size: "20",
        class: "buttonBarIcon",
        backgroundColor: "rgb(235, 235, 178)",
        accesskey: "w",
        sortOrder: 1,
        isDefault: true,
        functionName: "clickMenuEditSelectAllNone",
        params: "Auto",
        tooltipContent: "Selected/Unselect Widgets"
    },
    {
        id: 11,
        mainmenuItem: "Collaborate",
        menuText: "Edit All",
        shape: "download",
        size: "20",
        class: "buttonBarIcon",
        backgroundColor: "rgb(206, 206, 201)",
        accesskey: "w",
        sortOrder: 1,
        isDefault: true,
        functionName: "clickMenuEditSelectAllNone",
        params: "Auto",
        tooltipContent: "Selected/Unselect Widgets"
    },
    {
        id: 12,
        mainmenuItem: "User",
        menuText: "Edit All",
        shape: "download",
        size: "20",
        class: "buttonBarIcon",
        backgroundColor: "rgb(245, 148, 153)",
        accesskey: "w",
        sortOrder: 1,
        isDefault: true,
        functionName: "clickMenuEditSelectAllNone",
        params: "Auto",
        tooltipContent: "Selected/Unselect Widgets"
    },
  

]

@Component({
    selector: 'palette-buttonbar',
    templateUrl: './user.palette.buttonbar.component.html',
    styleUrls: ['./user.palette.buttonbar.component.css']
})
export class UserPaletteButtonBarComponent implements OnInit {

    @Output() formUserWidgetButtonBarClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    dashboardTags: DashboardTag[];
    paletteButtons: PaletteButtonBar[];
    userPaletteButtons: UserPaletteButtonBar[];
    widgetButtonsAvailable: ButtonBarAvailable[];
    widgetButtonsSelected: ButtonBarSelected[];
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.dashboardTags = this.globalVariableService.dashboardTags;
        this.widgetButtonsAvailable = this. globalVariableService.widgetButtonsAvailable;
        this.widgetButtonsSelected = this. globalVariableService.widgetButtonsSelected;

        this.globalVariableService.getPaletteButtonBar().then( pb => {
            this.globalVariableService.getUserPaletteButtonBar().then( up => {
                this.paletteButtons = pb;
                this.userPaletteButtons = up;
            });
        })
    }

    clickAvailable(id: number, index: number, ev: any){
        // Clicked a Value, now ....
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAvailable', '@Start');

        this.paletteButtons[index]['isSelected'] = ev.target.checked;
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formUserWidgetButtonBarClosed.emit(action);
    }

    clickAdd() {
        let x: ButtonBarSelected = {
            id: 12,
            buttonText: 'new one Added',
            description: '',
            sortOrder: 12
        }
        this.widgetButtonsSelected.push(x)
    }

    clickDelete() {
        this.widgetButtonsSelected.splice(this.widgetButtonsSelected.length-1,1)
    }

    clickItem(index: number) {
        console.log(index, this.widgetButtonsAvailable[index])
    }
}
