WORKING
{
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "description": "",
  "background": "transparent",
  "title": {
    "text": "",
    "anchor": "middle",
    "angle": 0,
    "baseline": "bottom",
    "color": "Gray",
    "font": "",
    "fontSize": 10,
    "fontWeight": 400,
    "limit": 0,
    "orient": "top"
  },
  "data": {
    "values": [
    ]
  },
  "transform": [],
  "config": {
    "style": {
      "cell": {
        "stroke": "lightgray"
      }
    }
  },
  "width": 240,
  "height": 240,
  "mark": {
    "type": "point",
    "tooltip": {
      "content": "data"
    },
    "orient": "horizontal",   // ""
    "line": false,
    "color": "",
    "cornerRadius": 0,
    "opacity": 1,
    "binSpacing": 0,
    "extent": ""
    //"size": 20
  },
  "encoding": {
    "x": {
      "field": "Acceleration",
      "type": "quantitative",
      "axis": {
        "grid": false,   // not there
        // "gridColor": "",
        "labels": true,
        "labelColor": "",
        "tickColor": "",
        "titleColor": "",
        "title": null,   // not there
        "maxExtent": 70
      },
      "scale": {
        "type": ""
      },
      "aggregate": "",
      "bin": false,
      "format": "",
      "stack": "",
      "sort": "",
      "timeUnit": ""
    },
    "y": {
      "field": "Cylinders",
      "type": "quantitative",
      "axis": {
        "grid": false,   // not there
        // "gridColor": "",
        "labels": true,
        "labelColor": "",
        "tickColor": "",
        "titleColor": "",
        "title": null,      // Not there
        "maxExtent": 80
      },
      "scale": {
        "type": ""
      },
      "aggregate": "",
      "bin": false,
      "format": "",
      "stack": "",
      "sort": "",
      "timeUnit": ""
    },
    "color": {
      "field": "",
      "type": "",
      "scale": "",
      "legend": ""
    },
    "size": {
      "field": ""
    }
  }
}