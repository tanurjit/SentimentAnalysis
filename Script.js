var data = {
    "dayMap": {

        "9/11/2016 5:05": [
            {
                "election": 0.93,
                "hilary": 1,
                "trump": 1
            },
            {
                "election": 0.47,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 5:03": [
            {
                "election": 0.06,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 4:59": [
            {
                "election": 0.11,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 4:55": [
            {
                "election": 1,
                "hilary": 21.27,
                "trump": 1
            }
        ],
        "9/11/2016 4:56": [
            {
                "election": 1,
                "hilary": 21.27,
                "trump": 1
            }
        ],
        "9/11/2016 4:54": [
            {
                "election": 0.11,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 4:53": [
            {
                "election": 0.04,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 4:52": [
            {
                "election": 1,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 4:51": [
            {
                "election": 1.89,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 4:50": [
            {
                "election": 0.06,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 4:49": [
            {
                "election": 2.32,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 4:37": [
            {
                "election": 1.08,
                "hilary": 1,
                "trump": 1
            },
            {
                "election": 2.32,
                "hilary": 1,
                "trump": 1
            },
            {
                "election": 38.67,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 4:33": [
            {
                "election": 1,
                "hilary": 0.64,
                "trump": 1
            },
            {
                "election": 0.11,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 2:23": [
            {
                "election": 0.11,
                "hilary": 1,
                "trump": 1
            },
            {
                "election": 0.93,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 2:06": [
            {
                "election": 1,
                "hilary": 0.11,
                "trump": 1
            }
        ],
        "9/11/2016 2:03": [
            {
                "election": 0.11,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 1:53": [
            {
                "election": 1,
                "hilary": 0.11,
                "trump": 1
            }
        ],
        "9/11/2016 2:11": [
            {
                "election": 0.11,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 2:15": [
            {
                "election": 0.11,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 1:45": [
            {
                "election": 1,
                "hilary": 1,
                "trump": 0.11
            }
        ],
        "9/11/2016 1:36": [
            {
                "election": 0.06,
                "hilary": 1,
                "trump": 1
            }
        ],
        "9/11/2016 1:33": [
            {
                "election": 1,
                "hilary": 1,
                "trump": 1
            }
        ]
    }
};
var margin = {
    top: 10,
    right: 10,
    bottom: 100,
    left: 40
}, margin2 = {
    top: 430,
    right: 10,
    bottom: 20,
    left: 40
}, width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%Y%m%d %H:%M")
    .parse;

var dispatch = d3.dispatch("pointMouseOver", "pointMouseout");

var x = d3.time.scale()
    .range([0, width]);
var x2 = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);
var y2 = d3.scale.linear()
    .range([height2, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom"),
    xAxis2 = d3.svg.axis()
        .scale(x2)
        .orient("bottom"),
    yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");



yAxis.ticks(height / 100)
    .tickSize(-width, 0);

var brush = d3.svg.brush()
    .x(x2)
    .on('brush', brush);

var line = d3.svg.line()
    .interpolate("linear")
    .x(function (d) {
        return x(d.date);
    })
    .y(function (d) {
        return y(d.value);
    });

var line2 = d3.svg.line()
    .interpolate("linear")
    .x(function (d) {
        return x2(d.date);
    })
    .y(function (d) {
        return y2(d.value);
    });

// append svg to body
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);


var focus = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


var fields = ['election', 'hilary', 'trump'];
color.domain(fields);
// process data
var dataset = data['dayMap'];

var forecasts = [];
var new_data = [];

$.each(dataset, function (key, value) {
    new_data.push(parseDate(key));
});

fields.map(function (d) {
    var data_t = [];
    $.each(dataset, function (key, value) {
        if (d in value['fields']) {
            data_t.push({
                date: parseDate(key),
                value: +value['fields'][d]
            });
        }
    });
    forecasts.push({
        values: data_t,
        name: d
    });
});

x.domain(d3.extent(new_data, function (d) {
    return d;
}));

y.domain([0, d3.max(forecasts, function (c) {
    return d3.max(c.values, function (v) {
        return v.value;
    });
})]);

x2.domain(x.domain());
y2.domain(y.domain());


var vertices = d3.merge(forecasts.map(function (line, lineIndex) {
    return line.values.map(function (point, pointIndex) {
        return {
            x: point.date,
            y: point.value,
            name: line.name,
            pointIndex: pointIndex
        }
    });
}));

// set up brush

var lines = [];

var forecast = focus.selectAll(".forecast")
    .data(forecasts)
    .enter()
    .append("g");

forecast.append("svg:path")
    .attr("class", "line forecast-large")
    .attr("d", function (d) {
        lines.push(line(d.values));
        return line(d.values);
    })
    .style("stroke", function (d) {
        return color(d.name);
    });


forecast.selectAll("circle")
    .data(vertices)
    .enter()
    .append("circle")
    .attr("fill", function (d) {
        return color(d.name);
    })
    .attr("r", 1)
    .attr("cx", function (d) {
        return x(d.x);
    })
    .attr("cy", function (d) {
        return y(d.y);
    });


focus.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

focus.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Impression");



var forecast = context.selectAll(".forecast")
    .data(forecasts)
    .enter()
    .append("g");

forecast.append("path")
    .attr("class", "line forecast-small")
    .attr("d", function (d) {
        return line2(d.values);
    })
    .style("stroke", function (d) {
        return color(d.name);
    });

context.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis2);

context.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("y", -6)
    .attr("height", height2 + 7);


var legend = svg.selectAll(".legend")
    .data(fields)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
    });

legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function (d) {
        return d;
    });


function brush() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.selectAll("path.forecast-large")
        .attr("d", function (d) {
            return line(d.values);
        });

    focus.selectAll("circle")
        .attr("r", 1)
        .attr("cx", function (d) {
            return x(d.x);
        })
        .attr("cy", function (d) {
            return y(d.y);
        });
    focus.select(".x.axis")
        .call(xAxis);
}