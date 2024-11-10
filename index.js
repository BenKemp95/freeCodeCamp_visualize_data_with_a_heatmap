fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then((info) => info.json())
    .then((data) => {
        console.log(data);

        const height = 500;
        const width = 1200;
        const padding = 100;
        const baseTemp = data.baseTemperature;
        console.log(baseTemp);
        let legend = [0, 3, 5.5, 8, 10.5];
        let legendDesc = ["<3", "3 < 5.5", "5.5 < 8", "8 < 10.5", ">10.5"]

        const svg = d3.select("body")
            .append("svg")
            .attr( "width", width)
            .attr( "height", height);

        const xScale = d3.scaleLinear()
            .domain([d3.min(data.monthlyVariance, (d) => (d.year)), d3.max(data.monthlyVariance, (d) => (d.year))])
            .range([padding, width-padding]);

        const yScale = d3.scaleLinear()
            .domain([d3.max(data.monthlyVariance, (d) => (d.month) + 1), d3.min(data.monthlyVariance, (d) => (d.month) + .5 )])
            .range([height-padding, padding]);


        const format = (d) => {
            return String(parseInt(d))
        }

        const addToolTip = d3.select("body").append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("background-color", "rgb(171, 190, 217)")
            .style("border-radius", "5px")
            .style("visibility", "hidden")

        let tooltipArray = [];

        svg.selectAll("rect")
            .data(data.monthlyVariance)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("data-year", d => d.year)
            .attr("data-month", d => (d.month) - 1)
            .attr("data-temp", d => d.variance + baseTemp)
            .attr("x", d => xScale(d.year))
            .attr("y", d => yScale((d.month)))
            .attr("width", width/(3153/12))
            .attr("height", (height - (2* padding)) / 12)
            .attr("fill", (d) => (d.variance + baseTemp) >= 10.5 ? "red" : (d.variance + baseTemp) >= 8 && (d.variance + baseTemp) < 10.5 ? "orange" : (d.variance + baseTemp) >= 5.5 && (d.variance + baseTemp) < 8 ? "yellow" : (d.variance + baseTemp) >= 3 && (d.variance + baseTemp) < 5.5 ? "teal" : (d.variance + baseTemp) < 3 ? "blue" : "white")
            .attr("stroke", "black")
            .attr("stroke-width", ".2px")
            .on("mouseover", (e , d ) => {
                tooltipArray = [`Year: ${d.year}`, `Month: ${d.month}`, `Temperature: ${(baseTemp + d.variance).toFixed(2)}C`, `Temp. Difference: ${(d.variance).toFixed(2)}C`];
                addToolTip.style('visibility', 'visible')
                    .style("opacity", 1)
                    .style("position", 'absolute')
                    .attr("data-year", d.year)
                    .style("top", `${e.clientY}px`)
                    .style("left", `${e.clientX}px`)
                    .selectAll("h1")
                    .data(tooltipArray)
                    .join("h1")
                    .style("font-size", "10px")
                    .text((text) => text)
                    .style("visibility", "visible")
            })
            .on("mouseout", function () {
                addToolTip.style("visibility", "hidden")
                    .style("opacity", 0)
            })

        const xAxis = d3.axisBottom(xScale).tickFormat(format).ticks(10);
        const yAxis = d3.axisLeft(yScale)
            .tickFormat((d) => d3.timeFormat("%B")(new Date(d,  d- 2 )))
            .ticks(12)


        svg.append("g")
            .attr("transform", "translate(0," + (height - padding) + ")")
            .attr("id", "x-axis")
            .call(xAxis);

        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .attr("id", "y-axis")
            .call(yAxis)

        svg.append("g")
            .append("text")
            .text("Monthly Global Land-Surface Temperature")
            .attr("x", (width + padding) / 4)
            .attr("y", padding / 2)
            .attr("font-weight", "bold")
            .attr("id", "title")

        svg.append("text")
            .attr("x", (width + padding) / 4)
            .attr("y", padding/1.5)
            .text("1753 - 2015 tracked differences from base 8.66℃ temperature")
            .attr("id", "description")

        var leg = svg.append("g")
            .attr("x", width/4)
            .attr("y", padding/1.5 )
            .attr("id", "legend")
            .selectAll("rect")
            .data(legend)
            .enter()
            .append("rect")
            .attr("x", (d,i) => 500 + (i*50))
            .attr("y", (d,i)=> 450)
            .attr("width", 50)
            .attr("height", 30)
            .attr("fill", (d) => (d) >= 10.5 ? "red" : (d) >= 8 && (d) < 10.5 ? "orange" : (d) >= 5.5 && (d) < 8 ? "yellow" : (d) >= 3 && (d) < 5.5 ? "teal" : (d) < 3 ? "blue" : "white")

            svg.append("g")
            .selectAll("text")
            .data(legendDesc)
            .enter()
            .append("text")
            .attr("x", (d,i) => 500 + (i*50))
            .attr("y", (d,i)=> 440)
            .text((d) => d)
                .attr("font-size", 12)


        const legXScale = d3.scaleLinear()
            .domain([10.5, 3])
            .range([height-padding, padding]);



    })