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

// import { load } from 'datalib';


// Own Services

// Own Components

// var dl = require('datalib');
// import * as sqlite3 from 'sqlite3';

@Component({
    styleUrls: ['./dashboard.component.css'],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    @ViewChild('vis', {read: ElementRef}) vis: ElementRef;  //Vega graph
    @Input() menuOptionSelected: string;

    open: Boolean = false;
    showSubMenuDashboard: boolean = true;
    showContainerHeader: boolean = false;
    showNavDashboard: Boolean = false;
    showNavTab: Boolean = false;
    showNavFormat: Boolean = false;
    showNavDataset: Boolean = true;
    showNavExplore: Boolean = false;
    showNavPresentation: Boolean = false;
    showNavCollaborate: Boolean = false;
    widgetBorder: string = '1px black solid';

    vlSpecs: dl.spec.TopLevelExtendedSpec[] = [
        {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "data": {
              "values": [
                {"a": "C", "b": 2}, {"a": "C", "b": 7}, {"a": "C", "b": 4},
                {"a": "D", "b": 1}, {"a": "D", "b": 2}, {"a": "D", "b": 6},
                {"a": "E", "b": 8}, {"a": "E", "b": 4}, {"a": "E", "b": 7}
              ]
            },
            "mark": "bar",
            "encoding": {
              "y": {"field": "a", "type": "nominal"},
              "x": {
                "aggregate": "average", "field": "b", "type": "quantitative",
                "axis": {
                  "title": "Average of b"
                }
              }
            }
        },
        {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "description": "A simple bar chart with embedded data.",
            "data": {
              "values": [
                {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
                {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
                {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
              ]
            },
            "mark": "bar",
            "encoding": {
              "x": {"field": "a", "type": "ordinal"},
              "y": {"field": "b", "type": "quantitative"}
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
        
        console.log('showGraph', event, this.menuOptionSelected)

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