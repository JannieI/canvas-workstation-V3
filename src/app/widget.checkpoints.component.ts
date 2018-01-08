// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';

// Our models
import { Datasource }                 from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions
import { compile, transform }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';
import * as dl from 'datalib';
import { load } from 'datalib';

const vlTemplateSpec1: dl.spec.TopLevelExtendedSpec =
{
      "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
      "description": "A simple bar chart with embedded data.",
      "width": 200,
      "autosize": {
        "type": "fit",
        "contains": "content"
      },
      "data":  {
          "url": "../assets/vega-datasets/flights-2k.json",
      },
      "transform": [{"calculate": "hours(datum.date)", "as": "time"}],

      "mark": "bar",
      "encoding": {
        "x": {"field": "origin", "type": "ordinal"},
        "y": {"field": "distance", "type": "quantitative",
          "axis": {
              "title": "Average Trading"
          }
        }
      }
};


const vlTemplateSpec2: any =
{
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
    "data": {
        "values": [{"date":"2001/01/14 21:55","delay":0,"distance":480,"origin":"SAN","destination":"SMF"},{"date":"2001/03/26 20:15","delay":-11,"distance":507,"origin":"PHX","destination":"SLC"},{"date":"2001/03/05 14:55","delay":-3,"distance":714,"origin":"ELP","destination":"LAX"}],
        "format": {"parse": {"date": "date"}}
  },
  "transform": [{"calculate": "hours(datum.date)", "as": "time"}],
  "repeat": {"column": ["distance", "delay", "time"]},
  "spec": {
    "layer": [{
      "selection": {
        "brush": {"type": "interval", "encodings": ["x"]}
      },
      "mark": "bar",
      "encoding": {
        "x": {
          "field": {"repeat": "column"},
          "bin": {"maxbins": 20},
          "type": "quantitative"
        },
        "y": {"aggregate": "count", "type": "quantitative"}
      }
    }, {
      "transform": [{"filter": {"selection": "brush"}}],
      "mark": "bar",
      "encoding": {
        "x": {
          "field": {"repeat": "column"},
          "bin": {"maxbins": 20},
          "type": "quantitative"
        },
        "y": {"aggregate": "count", "type": "quantitative"},
        "color": {"value": "goldenrod"}
      }
    }]
  }
}

const vlTemplateSpec3: any =
{
  "data": {"url": "../assets/vega-datasets/seattle-weather.csv"},
  "mark": "bar",
  "encoding": {
    "x": {
      "timeUnit": "month",
      "field": "date",
      "type": "ordinal"
    },
    "y": {
      "aggregate": "count",
      "field": "*",
      "type": "quantitative"
    },
    "color": {
      "field": "weather",
      "type": "nominal"
    }
  }
}

const vlTemplateSpec4: any =
{
  "data": {"url": "../assets/vega-datasets/seattle-weather.csv"},
  "mark": "bar",
  "encoding": {
    "x": {
      "timeUnit": "month",
      "field": "date",
      "type": "ordinal",
      "axis": {"title": "Month of the year"}
    },
    "y": {
      "aggregate": "count",
      "type": "quantitative"
    },
    "color": {
      "field": "weather",
      "type": "nominal",
      "scale": {
        "domain": ["sun","fog","drizzle","rain","snow"],
        "range": ["#e7ba52","#c7c7c7","#aec7e8","#1f77b4","#9467bd"]
      },
      "legend": {"title": "Weather type"}
    }
  }
}

const vlTemplateSpec5: any =
{
  "data": {"url": "../assets/vega-datasets/seattle-weather.csv"},
  "mark": "tick",
  "encoding": {
    "x": {"field": "precipitation", "type": "quantitative"}
  }
}

const vlTemplateSpec6: any =
{
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "data": {"url": "../assets/vega-datasets/cars.json"},
  "mark": "circle",
  "encoding": {
    "x": {"field": "Horsepower", "type": "quantitative"},
    "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
  }
}

const vlTemplateSpec7: any =
{
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "data": {"url": "../assets/vega-datasets/movies.json"},
  "mark": "circle",
  "encoding": {
    "x": {
      "bin": {"maxbins": 10},
      "field": "IMDB_Rating",
      "type": "quantitative"
    },
    "y": {
      "bin": {"maxbins": 10},
      "field": "Rotten_Tomatoes_Rating",
      "type": "quantitative"
    },
    "size": {
      "aggregate": "count",
      "type": "quantitative"
    }
  }
}

const vlTemplateSpec8: any =
{
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "description": "Stock prices of 5 Tech Companies over Time.",
  "data": {"url": "../assets/vega-datasets/stocks.csv"},
  "mark": "line",
  "encoding": {
    "x": {"field": "date", "type": "temporal", "axis": {"format": "%Y"}},
    "y": {"field": "price", "type": "quantitative"},
    "color": {"field": "symbol", "type": "nominal"}
  }
}

const vlTemplateSpec9: any =
{
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "data": {"url": "../assets/vega-datasets/cars.json"},
  "mark": "rect",
  "encoding": {
    "y": {"field": "Origin", "type": "nominal"},
    "x": {"field": "Cylinders", "type": "ordinal"},
    "color": {"aggregate": "mean", "field": "Horsepower", "type": "quantitative"}
  }
}

const vlTemplateSpec10: any =
{
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "data": {"url": "../assets/vega-datasets/movies.json"},
  "mark": "rect",
  "width": 300,
  "height": 200,
  "encoding": {
    "x": {
      "bin": {"maxbins":60},
      "field": "IMDB_Rating",
      "type": "quantitative"
    },
    "y": {
      "bin": {"maxbins": 40},
      "field": "Rotten_Tomatoes_Rating",
      "type": "quantitative"
    },
    "color": {
      "aggregate": "count",
      "type": "quantitative"
    }
  },
  "config": {
    "range": {
      "heatmap": {
        "scheme": "greenblue"
      }
    },
    "view": {
      "stroke": "transparent"
    }
  }
}

const vlTemplateSpec11: any =
{
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "data": { "url": "../assets/vega-datasets/github.csv"},
  "mark": "circle",
  "encoding": {
    "y": {
      "field": "time",
      "type": "ordinal",
      "timeUnit": "day"
    },
    "x": {
      "field": "time",
      "type": "ordinal",
      "timeUnit": "hours"
    },
    "size": {
      "field": "count",
      "type": "quantitative",
      "aggregate": "sum"
    }
  }
}

const vlTemplateSpec12: any =
{
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "width": 300,
  "height": 200,
  "data": {"url": "../assets/vega-datasets/unemployment-across-industries.json"},
  "mark": "line",
  "encoding": {
    "x": {
      "timeUnit": "yearmonth", "field": "date", "type": "temporal",
      "axis": {"format": "%Y"}
    },
    "y": {
      "aggregate": "sum", "field": "count", "type": "quantitative",
      "axis": {"title": "count"}
    },
    "color": {
      "field": "series",
      "type": "nominal"
    }
  }
}

const vlTemplateSpec13: dl.spec.TopLevelExtendedSpec =
{
  "data": {"url": "../assets/vega-datasets/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"field": "Horsepower", "type": "quantitative"},
    "y": {"field": "Miles_per_Gallon", "type": "quantitative"},
    "color": {"field": "Displacement", "type": "quantitative"}
  }
}

const vlTemplateSpec14: any =
{
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "data": {"url": "../assets/vega-datasets/unemployment-across-industries.json"},
  "width": 300, "height": 200,
  "mark": "area",
  "encoding": {
    "x": {
      "timeUnit": "yearmonth", "field": "date", "type": "temporal",
      "axis": {"domain": false, "format": "%Y"}
    },
    "y": {
      "aggregate": "sum", "field": "count","type": "quantitative",
      "axis": null,
      "stack": "normalize"

    },
    "color": {"field":"series", "type":"nominal", "scale":{"scheme": "category20b"}}
  }
}

const vlTemplateSpec15: any =
{
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "width": 300, "height": 200,
  "data": {"url": "../assets/vega-datasets/unemployment-across-industries.json"},
  "mark": "area",
  "encoding": {
    "x": {
      "timeUnit": "yearmonth", "field": "date", "type": "temporal",
      "axis": {"domain": false, "format": "%Y", "tickSize": 0}
    },
    "y": {
      "aggregate": "sum", "field": "count","type": "quantitative",
      "axis": null,
      "stack": "center"
    },
    "color": {"field":"series", "type":"nominal", "scale":{"scheme": "category20b"}}
  }
}

const vlTemplateSpec16: any =
{
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "description": "A diverging stacked bar chart for sentiments towards a set of eight questions, displayed as percentages with neutral responses straddling the 0% mark",
  "data": {
    "values":
    [
      {
        "question": "Question 1",
        "type": "Strongly disagree",
        "value": 24,
        "percentage": 0.7,
        "percentage_start": -19.1,
        "percentage_end": -18.4
      },
      {
        "question": "Question 1",
        "type": "Disagree",
        "value": 294,
        "percentage": 9.1,
        "percentage_start": -18.4,
        "percentage_end": -9.2
      },
      {
        "question": "Question 1",
        "type": "Neither agree nor disagree",
        "value": 594,
        "percentage": 18.5,
        "percentage_start": -9.2,
        "percentage_end": 9.2
      },
      {
        "question": "Question 1",
        "type": "Agree",
        "value": 1927,
        "percentage": 59.9,
        "percentage_start": 9.2,
        "percentage_end": 69.2
      },
      {
        "question": "Question 1",
        "type": "Strongly agree",
        "value": 376,
        "percentage": 11.7,
        "percentage_start": 69.2,
        "percentage_end": 80.9
      },

      {
        "question": "Question 2",
        "type": "Strongly disagree",
        "value": 2,
        "percentage": 18.2,
        "percentage_start": -36.4,
        "percentage_end": -18.2
      },
      {
        "question": "Question 2",
        "type": "Disagree",
        "value": 2,
        "percentage": 18.2,
        "percentage_start": -18.2,
        "percentage_end": 0
      },
      {
        "question": "Question 2",
        "type": "Neither agree nor disagree",
        "value": 0,
        "percentage": 0,
        "percentage_start": 0,
        "percentage_end": 0
      },
      {
        "question": "Question 2",
        "type": "Agree",
        "value": 7,
        "percentage": 63.6,
        "percentage_start": 0,
        "percentage_end": 63.6
      },
      {
        "question": "Question 2",
        "type": "Strongly agree",
        "value": 11,
        "percentage": 0,
        "percentage_start": 63.6,
        "percentage_end": 63.6
      },

      {
        "question": "Question 3",
        "type": "Strongly disagree",
        "value": 2,
        "percentage": 20,
        "percentage_start": -30,
        "percentage_end": -10
      },
      {
        "question": "Question 3",
        "type": "Disagree",
        "value": 0,
        "percentage": 0,
        "percentage_start": -10,
        "percentage_end": -10
      },
      {
        "question": "Question 3",
        "type": "Neither agree nor disagree",
        "value": 2,
        "percentage": 20,
        "percentage_start": -10,
        "percentage_end": 10
      },
      {
        "question": "Question 3",
        "type": "Agree",
        "value": 4,
        "percentage": 40,
        "percentage_start": 10,
        "percentage_end": 50
      },
      {
        "question": "Question 3",
        "type": "Strongly agree",
        "value": 2,
        "percentage": 20,
        "percentage_start": 50,
        "percentage_end": 70
      },

      {
        "question": "Question 4",
        "type": "Strongly disagree",
        "value": 0,
        "percentage": 0,
        "percentage_start": -15.6,
        "percentage_end": -15.6
      },
      {
        "question": "Question 4",
        "type": "Disagree",
        "value": 2,
        "percentage": 12.5,
        "percentage_start": -15.6,
        "percentage_end": -3.1
      },
      {
        "question": "Question 4",
        "type": "Neither agree nor disagree",
        "value": 1,
        "percentage": 6.3,
        "percentage_start": -3.1,
        "percentage_end": 3.1
      },
      {
        "question": "Question 4",
        "type": "Agree",
        "value": 7,
        "percentage": 43.8,
        "percentage_start": 3.1,
        "percentage_end": 46.9
      },
      {
        "question": "Question 4",
        "type": "Strongly agree",
        "value": 6,
        "percentage": 37.5,
        "percentage_start": 46.9,
        "percentage_end": 84.4
      },

      {
        "question": "Question 5",
        "type": "Strongly disagree",
        "value": 0,
        "percentage": 0,
        "percentage_start": -10.4,
        "percentage_end": -10.4
      },
      {
        "question": "Question 5",
        "type": "Disagree",
        "value": 1,
        "percentage": 4.2,
        "percentage_start": -10.4,
        "percentage_end": -6.3
      },
      {
        "question": "Question 5",
        "type": "Neither agree nor disagree",
        "value": 3,
        "percentage": 12.5,
        "percentage_start": -6.3,
        "percentage_end": 6.3
      },
      {
        "question": "Question 5",
        "type": "Agree",
        "value": 16,
        "percentage": 66.7,
        "percentage_start": 6.3,
        "percentage_end": 72.9
      },
      {
        "question": "Question 5",
        "type": "Strongly agree",
        "value": 4,
        "percentage": 16.7,
        "percentage_start": 72.9,
        "percentage_end": 89.6
      },

      {
        "question": "Question 6",
        "type": "Strongly disagree",
        "value": 1,
        "percentage": 6.3,
        "percentage_start": -18.8,
        "percentage_end": -12.5
      },
      {
        "question": "Question 6",
        "type": "Disagree",
        "value": 1,
        "percentage": 6.3,
        "percentage_start": -12.5,
        "percentage_end": -6.3
      },
      {
        "question": "Question 6",
        "type": "Neither agree nor disagree",
        "value": 2,
        "percentage": 12.5,
        "percentage_start": -6.3,
        "percentage_end": 6.3
      },
      {
        "question": "Question 6",
        "type": "Agree",
        "value": 9,
        "percentage": 56.3,
        "percentage_start": 6.3,
        "percentage_end": 62.5
      },
      {
        "question": "Question 6",
        "type": "Strongly agree",
        "value": 3,
        "percentage": 18.8,
        "percentage_start": 62.5,
        "percentage_end": 81.3
      },

      {
        "question": "Question 7",
        "type": "Strongly disagree",
        "value": 0,
        "percentage": 0,
        "percentage_start": -10,
        "percentage_end": -10
      },
      {
        "question": "Question 7",
        "type": "Disagree",
        "value": 0,
        "percentage": 0,
        "percentage_start": -10,
        "percentage_end": -10
      },
      {
        "question": "Question 7",
        "type": "Neither agree nor disagree",
        "value": 1,
        "percentage": 20,
        "percentage_start": -10,
        "percentage_end": 10
      },
      {
        "question": "Question 7",
        "type": "Agree",
        "value": 4,
        "percentage": 80,
        "percentage_start": 10,
        "percentage_end": 90
      },
      {
        "question": "Question 7",
        "type": "Strongly agree",
        "value": 0,
        "percentage": 0,
        "percentage_start": 90,
        "percentage_end": 90
      },

      {
        "question": "Question 8",
        "type": "Strongly disagree",
        "value": 0,
        "percentage": 0,
        "percentage_start": 0,
        "percentage_end": 0
      },
      {
        "question": "Question 8",
        "type": "Disagree",
        "value": 0,
        "percentage": 0,
        "percentage_start": 0,
        "percentage_end": 0
      },
      {
        "question": "Question 8",
        "type": "Neither agree nor disagree",
        "value": 0,
        "percentage": 0,
        "percentage_start": 0,
        "percentage_end": 0
      },
      {
        "question": "Question 8",
        "type": "Agree",
        "value": 0,
        "percentage": 0,
        "percentage_start": 0,
        "percentage_end": 0
      },
      {
        "question": "Question 8",
        "type": "Strongly agree",
        "value": 2,
        "percentage": 100,
        "percentage_start": 0,
        "percentage_end": 100
      }
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {
      "field": "percentage_start",
      "type": "quantitative",
      "axis": { "title": "Percentage" }
    },
    "x2": {
      "field": "percentage_end",
      "type": "quantitative"
    },
    "y": {
      "field": "question",
      "type": "nominal",
      "axis": {
        "title": "Question",
        "offset": 5,
        "ticks": false,
        "minExtent": 60,
        "domain": false
      }
    },
    "color": {
      "field": "type",
      "type": "nominal",
      "legend": { "title": "Response" },
      "scale": {
        "domain":
          [
            "Strongly disagree",
            "Disagree",
            "Neither agree nor disagree",
            "Agree",
            "Strongly agree"
          ],
        "range": ["#c30d24", "#f3a583", "#cccccc", "#94c6da", "#1770ab"],
        "type": "ordinal"
      }
    }
  }
}

const vlTemplateSpec17: any =
{
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "description": "Anscombe's Quartet",
  "data": {"url": "../assets/vega-datasets/anscombe.json"},
  "width": 200,
  "autosize": {
    "type": "fit",
    "contains": "padding"
  },
  "mark": "circle",
  "encoding": {
    "column": {"field": "Series", "type": "nominal"},
    "x": {
      "field": "X",
      "type": "quantitative",
      "scale": {"zero": false}
    },
    "y": {
      "field": "Y",
      "type": "quantitative",
      "scale": {"zero": false}
    },
    "opacity": {"value": 1}
  }
}

const vlTemplateSpec18: any =
{
  "repeat": {"column": ["Horsepower","Miles_per_Gallon", "Acceleration"]},
  "spec": {
    "data": {"url": "../assets/vega-datasets/cars.json"},
    "mark": "bar",
    "encoding": {
      "x": {
        "field": {"repeat": "column"},
        "bin": true,
        "type": "quantitative"
      },
      "y": {"aggregate": "count","type": "quantitative"},
      "color": {"field": "Origin","type": "nominal"}
    }
  }
}

const vlTemplateSpec19: any =
{
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "data": {"url": "../assets/vega-datasets/cars.json"},
  "mark": "rect",
  "encoding": {
    "y": {"field": "Origin", "type": "nominal"},
    "x": {"field": "Cylinders", "type": "ordinal"},
    "color": {"aggregate": "mean", "field": "Horsepower", "type": "quantitative"}
  }
}

const vlTemplate: dl.spec.TopLevelExtendedSpec =
{
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",

    // Properties for top-level specification (e.g., standalone single view specifications)
    "background": "",
    "padding": "",
    // "autosize": "",          NB - add these only if needed, blank causes no graph display
    // "config": "",            NB - add these only if needed, blank causes no graph display

    // Properties for any specifications
    "title":
        {
            "text": "",
            "anchor": "",
            "offset": "",
            "orient": "",
            "style": ""
        },
    "name": "",
    "transform": "",

    "description": "",
    "data":
        {
            "values": ""
        },
    "mark":
        {
            "type": "",  //bar circle square tick line area point rule text
            "style": "",
            "clip": ""
        },
    "encoding":
        {
            "x":
                {
                    "aggregate": "",
                    "field": "",
                    "type": "ordinal",
                    "bin": "",
                    "timeUnit": "",
                    "axis":
                    {
                        "title": ""
                    },
                    "scale": "",
                    "legend": "",
                    "format": "",
                    "stack": "",
                    "sort": "",
                    "condition": ""
                },
            "y":
                {
                    "aggregate": "",
                    "field": "",
                    "type": "quantitative",
                    "bin": "",
                    "timeUnit": "",
                    "axis":
                        {
                            "title": ""
                        },
                    "scale": "",
                    "legend": "",
                    "format": "",
                    "stack": "",
                    "sort": "",
                    "condition": ""
                    }
        }
}





@Component({
    selector: 'widget-checkpoints',
    templateUrl: './widget.checkpoints.component.html',
    styleUrls: ['./widget.checkpoints.component.css']
  })
  export class WidgetCheckpointsComponent implements OnInit {

    @Output() formWidgetCheckpointsClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    rowField: string = 'Drag a field here ...';
    colField: string = 'Drag a field here ...';
    colorField: string = 'Drag a field here ...';
    graphCols: string[];
    graphRows: string[];
    graphColor: string[];

    clickedButtonAggregateNo: boolean = false;
    dataFieldNames: string[];

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
        private router: Router,
    ) {}

    ngOnInit() {
    }

    ngAfterViewInit() {

        let definition = this.createVegaLiteSpec(undefined,'bar',undefined,undefined,undefined);

        // Render
        this.renderGraph(definition)

    }

    clickSelectStep() {
        let definition = this.createVegaLiteSpec(undefined,'line',undefined,undefined,undefined);

        // Render
        this.renderGraph(definition)

    }

    renderGraph(definition: any) {
        let specification = compile(definition).spec;
        let view = new View(parse(specification));
        view.renderer('svg')
            .width(300)
            .height(240)
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();
            this.renderer.setElementStyle(this.dragWidget.nativeElement,
                'left', "200px");
    }

  	clickClose(action: string) {
	  	this.formWidgetCheckpointsClosed.emit(action);
        }

    createVegaLiteSpec(
        description: string = 'First bar chart.',
        mark: string = 'bar',
        xfield: string = 'Month',
        yfield: string = 'Trades',
        title: string = 'Average Trading'): dl.spec.TopLevelExtendedSpec {

        let vlSpecsNew: dl.spec.TopLevelExtendedSpec = vlTemplate;

        vlSpecsNew['data']['values'] = [
            {"Month": "02","Trades": 28}, {"Month": "02","Trades": 55},
            {"Month": "03","Trades": 43}, {"Month": "04","Trades": 91},
            {"Month": "05","Trades": 81}, {"Month": "06","Trades": 53},
            {"Month": "07","Trades": 19}, {"Month": "08","Trades": 87},
            {"Month": "09","Trades": 52}, {"Month": "10","Trades": 42},
            {"Month": "11","Trades": 62}, {"Month": "12","Trades": 82}
        ];
        vlSpecsNew['description'] = description;
        vlSpecsNew['mark']['type'] = mark;
        vlSpecsNew['encoding']['x']['field'] = xfield;
        vlSpecsNew['encoding']['y']['field'] = yfield;
        vlSpecsNew['title']['text'] = title;
        console.log('createVegaLiteSpec', vlSpecsNew)

        return vlSpecsNew;

    }

  }