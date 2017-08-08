geomapfilename = "Sentiment.csv";
var margin = { top: 30, right: 0, bottom: 20, left: 0 },
    width = 400,
    height = 300 - margin.top - margin.bottom,
    formatNumber = d3.format(",d"),
    formatPercent = d3.format(".0%"),
    transitioning;

var tooltip = d3.select("body").append("div")
    .attr("class", "Ctooltip")
    .style("opacity", 0);
// sets x and y scale to determine size of visible boxes
var x = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, height])
    .range([0, height]);

// adding a color scale
var color = d3.scale.category20c();

// introduce color scale here

var treemap = d3.layout.treemap()
    .children(function (d, depth) { return depth ? null : d._children; })
    .sort(function (a, b) { return a.value - b.value; })
    .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
    .round(false);

var svg = d3.select("#chart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
    .style("margin-left", -margin.left + "px")
    .style("margin.right", -margin.right + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("shape-rendering", "crispEdges");

var grandparent = svg.append("g")
    .attr("class", "grandparent");

grandparent.append("rect")
    .attr("y", -margin.top)
    .attr("width", width)
    .attr("height", margin.top)
    .attr("fill", "grey");

grandparent.append("text")
    .attr("x", 6)
    .attr("y", 6 - margin.top)
    .attr("dy", ".75em");

// functions

function initialize(root) {
    root.x = root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
}
function accumulate(d) {
    return (d._children = d.children)
        // recursion step, note that p and v are defined by reduce
        ? d.value = d.children.reduce(function (p, v) { return p + accumulate(v); }, 0)
        : d.value;
}

function layout(d) {
    if (d._children) {
        // treemap nodes comes from the treemap set of functions as part of d3
        treemap.nodes({ _children: d._children });
        d._children.forEach(function (c) {
            c.x = d.x + c.x * d.dx;
            c.y = d.y + c.y * d.dy;
            c.dx *= d.dx;
            c.dy *= d.dy;
            c.parent = d;
            // recursion
            layout(c);
        });
    }
}

d3.json("fl.json", function (root) {
    console.log(root)
    initialize(root);
    accumulate(root);
    layout(root);
    display(root);

    function display(d) {
        grandparent
            .datum(d.parent)
            .on("click", transition)
            .select("text")
            .text(name(d))

        var g1 = svg.insert("g", ".grandparent")
            .datum(d)
            .attr("class", "depth");

        var g = g1.selectAll("g")
            .data(d._children)
            .enter().append("g");

        g.filter(function (d) { return d._children; })
            .classed("children", true)
            .on("click", transition);

        g.selectAll(".child")
            .data(function (d) { return d._children || [d]; })
            .enter().append("rect")
            .attr("class", "child")
            .call(rect);

        g.append("rect")
            .attr("class", "parent")
            .call(rect)
            .on("click", function (d) {
                //if (!d.children) {
                // do something extra if required
                //}
                console.log(d.name);
                // write function to show glyphs of only that emotion or sentiment
                if (d.name == "Positive") {
                    geomapfilename = "Positive.csv";
                }
                else if (d.name == "Negative") {
                    geomapfilename = "Negative.csv";
                }
                else if (d.name == "Neutral") {
                    geomapfilename = "Neutral.csv";
                }
                else if (d.name == "Anger") {
                    geomapfilename = "Anger.csv";
                }
                else if (d.name == "Sadness") {
                    geomapfilename = "Sadness.csv";
                }
                else if (d.name == "Joy") {
                    geomapfilename = "Joy.csv";
                }
                else if (d.name == "Surprise") {
                    geomapfilename = "Surprise.csv";
                }
                else if (d.name == "Trust") {
                    geomapfilename = "Trust.csv";
                }
                else if (d.name == "Fear") {
                    geomapfilename = "Fear.csv";
                }
                else if (d.name == "Disgust") {
                    geomapfilename = "Disgust.csv";
                }
                else if (d.name == "Anticipation") {
                    geomapfilename = "Anticipation.csv";
                }
                else if (d.name == "Trump") {
                    geomapfilename = "Trump.csv";
                }
                else if (d.name == "Hillary") {
                    geomapfilename = "Hillary.csv";
                }
                else if (d.name == "Election") {
                    geomapfilename = "Election.csv";
                }
                DrawGeomap(geomapfilename);
            })
            .append("title")
            .text(function (d) {
                return d.name + " " + formatNumber(d.value) + " " + formatNumber(d.parent.value) + " " + (d.value / d.parent.value) * 100 + "%"
            });


        g.append("text")
            .attr("dy", ".75em")
            .text(function (d) { return d.name; })
            .call(text);

        function transition(d) {
            if (transitioning || !d) return;
            transitioning = true;

            var g2 = display(d),
                t1 = g1.transition().duration(750),
                t2 = g2.transition().duration(750);

            // Update the domain only after entering new elements.
            x.domain([d.x, d.x + d.dx]);
            y.domain([d.y, d.y + d.dy]);

            // Enable anti-aliasing during the transition.
            svg.style("shape-rendering", null);

            // Draw child nodes on top of parent nodes.
            svg.selectAll(".depth").sort(function (a, b) { return a.depth - b.depth; });

            // Fade-in entering text.
            g2.selectAll("text").style("fill-opacity", 0);

            // Transition to the new view.
            t1.selectAll("text").call(text).style("fill-opacity", 0);
            t2.selectAll("text").call(text).style("fill-opacity", 1);
            t1.selectAll("rect").call(rect);
            t2.selectAll("rect").call(rect);

            // Remove the old node when the transition is finished.
            t1.remove().each("end", function () {
                svg.style("shape-rendering", "crispEdges");
                transitioning = false;
            });
        }

        return g;
    }

    function text(text) {
        text.attr("x", function (d) { return x(d.x) + 6; })
            .attr("y", function (d) { return y(d.y) + 6; })
        //.attr("fill","lightpink");
    }

    function rect(rect) {
        rect.attr("x", function (d) { return x(d.x); })
            .attr("y", function (d) { return y(d.y); })
            .attr("width", function (d) { return x(d.x + d.dx) - x(d.x); })
            .attr("height", function (d) { return y(d.y + d.dy) - y(d.y); })
            .attr("fill", function (d) { return d.parent ? color(d.name) : red; });
    }

    function name(d) {
        return d.parent
            ? name(d.parent) + "." + d.name
            : d.name;
    }




});

