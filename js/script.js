const width = 900;
const height = 550;
const margin = { top: 20, right: 20, bottom: 50, left: 60 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Load CSV
d3.csv("data/dataset.csv").then(data => {

    // Convert numeric data
    data.forEach(d => {
        d.trip_distance = +d.trip_distance;
        d.total_amount = +d.total_amount;
        d.payment_type = +d.payment_type;
    });

    // Lightweight filtering for speed
    data = data.filter(d =>
        d.trip_distance > 0 &&
        d.trip_distance < 30 &&
        d.total_amount > 0 &&
        d.total_amount < 150
    );

    // Scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.trip_distance))
        .nice()
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.total_amount))
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Light color palette
    const color = d3.scaleOrdinal()
        .domain([...new Set(data.map(d => d.payment_type))])
        .range(d3.schemeSet2);

    // ----- Axes -----
    const gX = svg.append("g")
        .attr("opacity", 0)
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    const gY = svg.append("g")
        .attr("opacity", 0)
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

    // Fade-in axis animation
    gX.transition().duration(800).attr("opacity", 1);
    gY.transition().duration(800).attr("opacity", 1);

    // Axis labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .text("Trip Distance (miles)");

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Fare Amount ($)");

    // ----- Scatter points (with pop-in animation) -----
    svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.trip_distance))
        .attr("cy", d => y(d.total_amount))
        .attr("fill", d => color(d.payment_type))
        .attr("opacity", 0)
        .attr("r", 0)

        // Pop-in animation
        .transition()
        .delay((d, i) => i * 2) // stagger
        .duration(400)
        .attr("opacity", 0.7)
        .attr("r", 5);
});
