        var margint = { top: 10, right: 10, bottom: 100, left: 40 },
            margint2 = { top: 430, right: 10, bottom: 20, left: 40 },
            widtht = 960 - margint.left - margint.right,
            heightt = 500 - margint.top - margint.bottom,
            heightt2 = 500 - margint2.top - margint2.bottom;

        var color = d3.scale.category10();

        var parseDate = d3.time.format("%d/%m/%Y %H:%M").parse;

        var xt = d3.time.scale().range([0, widtht]),
            xt2 = d3.time.scale().range([0, widtht]),
            yt = d3.scale.linear().range([heightt, 0]),
            yt2 = d3.scale.linear().range([heightt2, 0]);

        var xAxist = d3.svg.axis().scale(xt).orient("bottom"),
            xAxist2 = d3.svg.axis().scale(xt2).orient("bottom"),
            yAxist = d3.svg.axis().scale(yt).orient("left");

        var brush = d3.svg.brush()
            .xt(xt2)
            .on("brush", brush);

        var line = d3.svg.line()
            .defined(function (d) { return !isNaN(d.temperature); })
            .interpolate("cubic")
            .xt(function (d) { return xt(d.date); })
            .yt(function (d) { return yt(d.temperature); });

        var line2 = d3.svg.line()
            .defined(function (d) { return !isNaN(d.temperature); })
            .interpolate("cubic")
            .xt(function (d) { return xt2(d.date); })
            .yt(function (d) { return yt2(d.temperature); });

        var svg = d3.select("#chart4").append("svg")
            .attr("width", widtht + margint.left + margint.right)
            .attr("height", heightt + margint.top + margint.bottom);

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", widtht)
            .attr("height", heightt);

        var focus = svg.append("g")
            .attr("transform", "translate(" + margint.left + "," + margint.top + ")");

        var context = svg.append("g")
            .attr("transform", "translate(" + margint2.left + "," + margint2.top + ")");

        d3.csv("dt.csv", function (error, data) {

            color.domain(d3.keys(data[0]).filter(function (key) { return key !== "date"; }));

            data.forEach(function (d) {
             //   console.log(1, d.date);
                d.date = parseDate(d.date);
             //   console.log(d.date);
            });

            var sources = color.domain().map(function (name) {
                return {
                    name: name,
                    values: data.map(function (d) {
                        return { date: d.date, temperature: +d[name] };
                    })
                };
            });

           // console.log(sources);
            xt.domain(d3.extent(data, function (d) { return d.date; }));
            yt.domain([d3.min(sources, function (c) { return d3.min(c.values, function (v) { return v.temperature; }); }),
            d3.max(sources, function (c) { return d3.max(c.values, function (v) { return v.temperature; }); })]);
            xt2.domain(xt.domain());
            yt2.domain(yt.domain());

            var focuslineGroups = focus.selectAll("g")
                .data(sources)
                .enter().append("g");

            var focuslines = focuslineGroups.append("path")
                .attr("class", "line")
                .attr("d", function (d) { return line(d.values); })
                .style("stroke", function (d) { return color(d.name); })
                .attr("clip-path", "url(#clip)");

            focus.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + heightt + ")")
                .call(xAxist);

            focus.append("g")
                .attr("class", "y axis")
                .call(yAxist);

            var contextlineGroups = context.selectAll("g")
                .data(sources)
                .enter().append("g");

            var contextLines = contextlineGroups.append("path")
                .attr("class", "line")
                .attr("d", function (d) { return line2(d.values); })
                .style("stroke", function (d) { return color(d.name); })
                .attr("clip-path", "url(#clip)");

            context.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + heightt2 + ")")
                .call(xAxis2);

            context.append("g")
                .attr("class", "x brush")
                .call(brush)
                .selectAll("rect")
                .attr("y", -6)
                .attr("height", heightt2 + 7);


        });

        function brush() {
            xt.domain(brush.empty() ? xt2.domain() : brush.extent());
            focus.selectAll("path.line").attr("d", function (d) { return line(d.values) });
            focus.select(".x.axis").call(xAxist);
            focus.select(".y.axis").call(yAxist);
        }