/*
 * Dashboard
 */

// From Angular
import { AfterViewInit }              from '@angular/core';
import { Component }                  from '@angular/core';
import { Directive }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { Input }                      from '@angular/core';
import { Renderer }                   from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Vega, Vega-Lite
// declare var require: any;
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';
import * as dl from 'datalib';
import { load } from 'datalib';
import { BoxPlotStyle } from 'vega-lite/build/src/compositemark/boxplot';

// import { load } from 'datalib';


// Own Services

// Own Components

// var dl = require('datalib');
// import * as sqlite3 from 'sqlite3';

@Component({
    styleUrls: ['./explore.component.css'],
    templateUrl: './explore.component.html'
})
export class ExploreComponent {
    @ViewChild('vis', {read: ElementRef}) vis: ElementRef;  //Vega graph
    @Input() menuOptionSelected: string;

    graphType: string = 'BarChart';
    graphTypeFile: string = '../images/BarChart.png';
    isFirstTime: boolean = true;
    open: Boolean = false;
    showAdvancedField: boolean = false;
    showSubMenuDashboard: boolean = true;
    showContainerHeader: boolean = false;
    showNavDashboard: Boolean = false;
    showNavTab: Boolean = false;
    showNavFormat: Boolean = false;
    showNavDataset: Boolean = true;
    showNavExplore: Boolean = false;
    showNavPresentation: Boolean = false;
    showNavCollaborate: Boolean = false;
    showType: boolean = false;
    showTypeIcon: boolean = true;
    widgetBorder: string = '1px black solid';

    vlSpecs: dl.spec.TopLevelExtendedSpec[] = [
        {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "data": {
              "values": [
                {"Month": "C", "Profit": 2}, {"Month": "C", "Profit": 7}, {"Month": "C", "Profit": 4},
                {"Month": "D", "Profit": 1}, {"Month": "D", "Profit": 2}, {"Month": "D", "Profit": 6},
                {"Month": "E", "Profit": 8}, {"Month": "E", "Profit": 4}, {"Month": "E", "Profit": 7}
              ]
            },
            "mark": "bar",
            "encoding": {
              "y": {"field": "Month", "type": "nominal"},
              "x": {
                "aggregate": "average", "field": "Profit", "type": "quantitative",
                "axis": {
                  "title": "Average of Profit"
                }
              }
            }
        },
        {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "description": "A simple bar chart with embedded data.",
            "data": {
              "values": [
                {"Month": "01","Trades": 28}, {"Month": "02","Trades": 55}, 
                {"Month": "03","Trades": 43}, {"Month": "04","Trades": 91}, 
                {"Month": "05","Trades": 81}, {"Month": "06","Trades": 53},
                {"Month": "07","Trades": 19}, {"Month": "08","Trades": 87}, 
                {"Month": "09","Trades": 52}, {"Month": "10","Trades": 42},
                {"Month": "11","Trades": 62}, {"Month": "12","Trades": 82}
              ]
            },
            "mark": "bar",
            "encoding": {
              "x": {"field": "Month", "type": "ordinal"},
              "y": {"field": "Trades", "type": "quantitative",
                "axis": {
                    "title": "Average Trading"
                }
              }
            }
        }        
    ];
    constructor(
        private renderer: Renderer,
    ) {}

    ngAfterViewInit() {
    }

    ngOnChanges() {
        console.log('menuOptionSelected', this.menuOptionSelected)
    }

    showGraphs(event) {
        // Show Graph Examples
        
        this.showNavExplore = true;
        console.log('showGraph', event, this.menuOptionSelected)
        this.isFirstTime = false;
        let definition: dl.spec.TopLevelExtendedSpec = this.vlSpecs[1];
        let specification = compile(definition).spec;

        // Full Vega Spec
            specification = {
                "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                "width": 960,
                "height": 500,
                "autosize": "none",

                "data": [
                    {
                    "name": "unemp",
                    "url": "./assets/vega/vega-datasets/unemployment.tsv",
                    "format": {"type": "tsv", "parse": "auto"}
                    },
                    {
                    "name": "counties",
                    "url": "../assets/vega/vega-datasets/us-10m.json",
                    "format": {"type": "topojson", "feature": "counties"},
                    "transform": [
                        { "type": "lookup", "from": "unemp", "key": "id", "fields": ["id"], "as": ["unemp"] },
                        { "type": "filter", "expr": "datum.unemp != null" }
                    ]
                    }
                ],

                "projections": [
                    {
                    "name": "projection",
                    "type": "albersUsa"
                    }
                ],

                "scales": [
                    {
                    "name": "color",
                    "type": "quantize",
                    "domain": [0, 0.15],
                    "range": {"scheme": "blues-9"}
                    }
                ],

                "legends": [
                    {
                    "fill": "color",
                    "orient": "bottom-right",
                    "title": "Unemployment",
                    "format": "0.1%",
                    "encode": {
                        "symbols": {
                        "update": {
                            "shape": {"value": "square"},
                            "stroke": {"value": "#ccc"},
                            "strokeWidth": {"value": 0.2}
                        }
                        }
                    }
                    }
                ],

                "marks": [
                    {
                    "type": "shape",
                    "from": {"data": "counties"},
                    "encode": {
                        "enter": { "tooltip": {"signal": "format(datum.unemp.rate, '0.1%')"}},
                        "update": { "fill": {"scale": "color", "field": "unemp.rate"} },
                        "hover": { "fill": {"value": "red"} }
                    },
                    "transform": [
                        { "type": "geoshape", "projection": "projection" }
                    ]
                    }
                ]
            }
        // End of Full Vega Spec

        specification = compile(definition).spec;
       
        console.log('ss', specification)

        let view = new View(parse(specification));
        
        view.renderer('svg')
            // .width(500)
            // .height(500)
            .initialize(this.vis.nativeElement)
            .hover()
            .run()
            .finalize();


            // var view = new vg.View(vg.parse( this.widgets[i].graph.spec ));
            // view.renderer('svg')
            //     .initialize( this.childrenWidgets.toArray()[i].nativeElement)
            //     .hover()
            //     .run();





            // Load datalib.

            // Load and parse a CSV file. Datalib does type inference for you.
            // The result is an array of JavaScript objects with named values.
            // Parsed dates are stored as UNIX timestamp values.
            var data = dl.csv('http://vega.github.io/datalib/data/stocks.csv');

            // Show summary statistics for each column of the data table.
            console.log(dl.format.summary(data));

            // Compute mean and standard deviation by ticker symbol.
            var rollup = dl.groupby('symbol')
            .summarize({'price': ['mean', 'stdev']})
            .execute(data);
            console.log(dl.format.table(rollup));

            // Compute correlation measures between price and date.
            console.log(
            dl.cor(data, 'price', 'date'),      // Pearson product-moment correlation
            dl.cor.rank(data, 'price', 'date'), // Spearman rank correlation
            dl.cor.dist(data, 'price', 'date')  // Distance correlation
            );

            // Compute mutual information distance between years and binned price.
            var bin_price = dl.$bin(data, 'price'); // returns binned price values
            var year_date = dl.$year('date');       // returns year from date field
            var counts = dl.groupby(year_date, bin_price).count().execute(data);
            console.log(dl.mutual.dist(counts, 'bin_price', 'year_date', 'count'));
    }

    onClickSubmenu(menuOption: string) {

        if (menuOption == 'dashboard') {
            this.showNavDashboard = !this.showNavDashboard;
            this.showNavTab = false;
            this.showNavFormat = false;
            this.showNavDataset = false;
            this.showNavExplore = false;
            this.showNavPresentation = false;
            this.showNavCollaborate = false;
        }
        else if (menuOption == 'tab') {
            this.showNavDashboard = false;
            this.showNavTab = !this.showNavTab;
            this.showNavFormat = false;
            this.showNavDataset = false;
            this.showNavExplore = false;
            this.showNavPresentation = false;
            this.showNavCollaborate = false;
        }
        else if (menuOption == 'format') {
            this.showNavDashboard = false;
            this.showNavTab = false;
            this.showNavFormat = !this.showNavFormat;
            this.showNavDataset = false;
            this.showNavExplore = false;
            this.showNavPresentation = false;
            this.showNavCollaborate = false;
            }
        else if (menuOption == 'dataset') {
            this.showNavDashboard = false;
            this.showNavTab = false;
            this.showNavFormat = false;
            this.showNavDataset = !this.showNavDataset;
            this.showNavExplore = false;
            this.showNavPresentation = false;
            this.showNavCollaborate = false;
            }
        else if (menuOption == 'explore') {
            this.showNavDashboard = false;
            this.showNavTab = false;
            this.showNavFormat = false;
            if (!this.showNavExplore) {this.showNavDataset = !this.showNavExplore};
            this.showNavExplore = !this.showNavExplore;
            this.showNavPresentation = false;
            this.showNavCollaborate = false;
            }
        else if (menuOption == 'presentation') {
            this.showNavDashboard = false;
            this.showNavTab = false;
            this.showNavFormat = false;
            this.showNavDataset = false;
            this.showNavExplore = false;
            this.showNavPresentation = !this.showNavPresentation;
            this.showNavCollaborate = false;
        }
        else if (menuOption == 'collaborate') {
            this.showNavDashboard = false;
            this.showNavTab = false;
            this.showNavFormat = false;
            this.showNavDataset = false;
            this.showNavExplore = false;
            this.showNavPresentation = false;
            this.showNavCollaborate = !this.showNavCollaborate;
        }

    }

    clickButtonAddDashboard () {
        
        // Experiment: get SQLite from inside the browser
        // ----------------------------------------------
        // var db = new sqlite3.Database('./assets/test.db');
        // db.each("SELECT * FROM memos", (err, row) => {
        //   console.log(row.text);
        // });
        // db.close();        
    }

    clickWidget(ev) {
        console.log('clickWidget()', this.showContainerHeader,  this.showNavDataset, ev);
        this.showContainerHeader = !this.showContainerHeader;
        this.onClickSubmenu('explore');
    }

    clickIcon(selectedGraphType: string) {
        this.showTypeIcon = true;
        this.showType = false;
        this.graphType = selectedGraphType;  
        this.graphTypeFile = '../images/' + selectedGraphType + '.png';
    }

    clickAdvancedField() {
        this.showAdvancedField = !this.showAdvancedField;
    }
}



// /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
// function openNav() {
//     document.getElementById("mySidenav").style.width = "250px";
//     document.getElementById("main").style.marginLeft = "250px";
// }

// /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
// function closeNav() {
//     document.getElementById("mySidenav").style.width = "0";
//     document.getElementById("main").style.marginLeft = "0";
// }