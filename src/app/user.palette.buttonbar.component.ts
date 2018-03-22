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
    paletteButtonsSelected: PaletteButtonBar[];
    userPaletteButtons: UserPaletteButtonBar[];
    widgetButtonsAvailable: ButtonBarAvailable[];
    widgetButtonsSelected: ButtonBarSelected[];
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards;
        this.dashboardTags = this.globalVariableService.dashboardTags;
        this.widgetButtonsAvailable = this. globalVariableService.widgetButtonsAvailable;
        this.widgetButtonsSelected = this. globalVariableService.widgetButtonsSelected;

        this.globalVariableService.getPaletteButtonBar().then( pb => {
            this.globalVariableService.getUserPaletteButtonBar().then( up => {

                // Total list of available buttons
                this.paletteButtons = pb.slice();
                this.paletteButtonsSelected = [];

                // Buttons for this user
                this.userPaletteButtons = up.filter(u => u.userID == 'Jannie').slice();

                // If none as yet, give him default ones
                if (this.userPaletteButtons.length == 0) {
                    this.paletteButtons.forEach(p => {
                        if (p.isDefault) {
                            this.userPaletteButtons.push(
                                {
                                    id: null,
                                    userID: this.globalVariableService.userID,
                                    paletteButtonBarID: p.id
                                }
                            )

                        };
                    });
                };

                // Mark user ones as selected
                this.paletteButtons.forEach(pb => {
                    this.userPaletteButtons.forEach(up => {
                        if (pb.id == up.paletteButtonBarID) {
                            pb.isSelected = true;
                        };
                    });
                });

                // Move selected ones across
                this.clickAdd();

            });
        })
    }

    clickAvailable(id: number, index: number){
        // Heighlight the clicked row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAvailable', '@Start');

        this.paletteButtons[index]['isSelected'] = !this.paletteButtons[index]['isSelected'];
    }

    clickSelected(id: number, index: number){
        // Heighlight the clicked row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelected', '@Start');

        this.paletteButtonsSelected[index]['isSelected'] = !this.paletteButtonsSelected[index]['isSelected'];
    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formUserWidgetButtonBarClosed.emit(action);
    }

    clickAdd() {
        // Add all selected on Available list to Selected list, and unselect original
        // Then sort the altered list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Get selected in Available, and add to Selected
        let availID: number[] = [];
        for (var i = 0; i < this.paletteButtons.length; i++) {

            if (this.paletteButtons[i].isSelected) {
                availID.push(this.paletteButtons[i].id);
                this.paletteButtonsSelected.push(this.paletteButtons[i]);
            };
        };

        // Unselect all from target
        this.paletteButtonsSelected.forEach(ps => ps.isSelected = false);

        // Delete the selected one, reverse order
        for (var i = this.paletteButtons.length - 1; i >= 0; i--) {
            if(availID.indexOf(this.paletteButtons[i].id) >= 0) {
                this.paletteButtons.splice(i, 1);
            };

        };

        // Sort the altered list
        this.paletteButtonsSelected.sort( (obj1,obj2) => {
            if (obj1.sortOrder > obj2.sortOrder) {
                return 1;
            };
            if (obj1.sortOrder < obj2.sortOrder) {
                return -1;
            };
            return 0;
        });

    }

    clickDelete() {
        // Add all selected on Selected list to Available list, and unselect original
        // Then sort the altered list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveDown', '@Start');

        // Get selected in Selected, and add to Selected
        let availID: number[] = [];
        for (var i = 0; i < this.paletteButtonsSelected.length; i++) {

            if (this.paletteButtonsSelected[i].isSelected) {
                availID.push(this.paletteButtonsSelected[i].id);
                this.paletteButtons.push(this.paletteButtonsSelected[i]);
            };
        };

        // Unselect all from target
        this.paletteButtons.forEach(ps => ps.isSelected = false);
        
        // Delete the selected one, reverse order
        for (var i = this.paletteButtonsSelected.length - 1; i >= 0; i--) {
            if(availID.indexOf(this.paletteButtonsSelected[i].id) >= 0) {
                this.paletteButtonsSelected.splice(i, 1);
            };

        };

        // Sort the altered list
        this.paletteButtons.sort( (obj1,obj2) => {
            if (obj1.sortOrder > obj2.sortOrder) {
                return 1;
            };
            if (obj1.sortOrder < obj2.sortOrder) {
                return -1;
            };
            return 0;
        });
    }

    clickMoveUp() {
        // Move selected row(s) up
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveUp', '@Start');

        // Swop sort order with predecessor
        for (var i = 1; i < this.paletteButtonsSelected.length; i++) {
            
            if (this.paletteButtonsSelected[i].isSelected) {
                console.log('xx is selected: i id sortOder', i, this.paletteButtonsSelected[i].id, 
                this.paletteButtonsSelected[i].sortOrder)

                // Count how many selected in this batch
                let nrSel: number = 1;
                for (var j = i + 1; j < this.paletteButtonsSelected.length; j++) {
                    if (this.paletteButtonsSelected[j].isSelected) {
                        nrSel = nrSel + 1;
                    } else {
                        break;
                    };
                };
                console.log('xx nrSel', nrSel)
                // Decrease those in this batch
                for (var k = i; k < (i + nrSel); k++) {
                    
                    this.paletteButtonsSelected[k].sortOrder = 
                        this.paletteButtonsSelected[k].sortOrder - 1;
                console.log('xx is loop k id sortOder', k, this.paletteButtonsSelected[k].id, 
                    this.paletteButtonsSelected[k].sortOrder)
                        
                };

                // Increment original unselected
                this.paletteButtonsSelected[i-1].sortOrder = 
                    this.paletteButtonsSelected[i-1].sortOrder + nrSel;
                    
                // Set Pointer
                i = i + nrSel;
                console.log('xx end  k, i []', k, i, this.paletteButtonsSelected)
            };
        };

        // Sort the altered list
        this.paletteButtonsSelected.sort( (obj1,obj2) => {
            if (obj1.sortOrder > obj2.sortOrder) {
                return 1;
            };
            if (obj1.sortOrder < obj2.sortOrder) {
                return -1;
            };
            return 0;
        });
        console.log('xx after sort', this.paletteButtonsSelected)
        
    }

    clickMoveDown() {
        // Move selected row(s) down
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveDown', '@Start');

        this.paletteButtonsSelected.forEach(pb => {
            if (pb.isSelected) {
                pb.sortOrder = pb.sortOrder + 1;
            }
        });
    }

    clickItem(index: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickItem', '@Start');

        console.log(index, this.widgetButtonsAvailable[index])
    }
}
