// Temporary service to define all data
import { canvasShape }                from '../models';

const localShapes: canvasShape[] =
[
    {

        // Type
        shapeType: 'circle',

        // Trashed
        isTrashed: false,

        // Not needed when Widget is inside a Dashboard
        dashboardID: 0,
        dashboardTabID: 0,
        dashboardTabName: '',

        // Identification and Description
        id: 0,
        name: '',
        description: '',
        version: 0,

        // @Runtime
        isSelected: false,

        // Links
        hyperlinkDashboardID: 0,
        hyperlinkDashboardTabID: 0,

        // Container
        containerBackgroundcolor: 'red',
        containerBorder: '',
        containerBoxshadow: '',
        containerColor: '',
        containerFontsize: 0,
        containerHeight: 100,
        containerLeft: 100,
        containerWidgetTitle: '',
        containerTop: 90,
        containerWidth: 100,
        containerZindex: 50,

        // Title
        titleText: '',
        titleBackgroundColor: '',
        titleBorder: '',
        titleColor: '',
        titleFontsize: 0,
        titleFontWeight: '',
        titleHeight: 120,
        titleLeft: 20,
        titleMargin: '',
        titlePadding: '',
        titlePosition: '',
        titleTextAlign: '',
        titleTop: 0,
        titleWidth: 0,

        // shape
        cx: '50',
        cy: '50',
        r: '40',
        stroke: 'black',
        strokeWidth: '3',
        fill: 'none',

        // Created, updated and refreshed
        widgetCreatedOn: '',
        widgetCreatedBy: '',
        widgetUpdatedOn: '',
        widgetUpdatedBy: '',
    }
]

export class httpFake {
    localShapes: canvasShape[] = localShapes;

    getProperties() {
        // TODO - Make this work correctly 
        // Returns list of properties in object
        return Object.getOwnPropertyNames(localShapes);
    }

    getLocalShapes() {
        return this.localShapes;
    }

    getSelective(fields: string) {
        // TODO - Make this work correctly to return only the fields given in the params
        let result: string[];

        console.log('prop', Object.getOwnPropertyNames(localShapes).length)
        console.log('p1', Object.getOwnPropertyNames(localShapes))
        console.log('dash', this.localShapes);
        console.log('entries', this.localShapes.entries)

        for (var i = 0; i < Object.getOwnPropertyNames(localShapes).length; i++) {

            for (var j = 0; i < this.localShapes.entries.length; j++) {
                console.log(this.localShapes.entries[j]
                    [Object.getOwnPropertyNames(localShapes)[i]] )
            }
        }
            
        return fields;
    }
}