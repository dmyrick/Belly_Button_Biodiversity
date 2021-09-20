function init() {
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        buildMetadata(sampleNames[0]);
        buildCharts(sampleNames[0]);
    })
}

init();


function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}


function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        PANEL.append("h6").text(`ID: ${result.id}`);
        PANEL.append("h6").text(`ETHNICITY: ${result.ethnicity}`);
        PANEL.append("h6").text(`GENDER: ${result.gender}`);
        PANEL.append("h6").text(`AGE: ${result.age}`);
        PANEL.append("h6").text(`LOCATION: ${result.location}`);
        PANEL.append("h6").text(`BBTYPE: ${result.bbtype}`);
        PANEL.append("h6").text(`WFREQ: ${result.wfreq}`);

    });
}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var sampleData = data.samples;
        var buildingArray = sampleData.filter(sampleObj => sampleObj.id == sample);
        var result = buildingArray[0];
        console.log(result)


        //  Bar Chart 

        // Create the ticks/labels for the bar chart.
        var yticks = result.otu_ids.slice(0, 10).reverse().map(function (elem) { return `OTU ${elem}` });
        var xticks = result.sample_values.slice(0, 10).reverse();
        var labels = result.otu_labels.slice(0, 10).reverse();

        var trace1 = {
            x: xticks,
            y: yticks,
            text: labels,
            type: 'bar',
            orientation: "h",
        };

        var data = [trace1];

        var layout = {
            title: '<b>Top 10 Bacteria Cultures Found'
        };

        Plotly.newPlot('barDiv', data, layout);

        // Bubble Chart

        var trace1 = {
            x: result.otu_ids,
            y: result.sample_values,
            text: result.otu_labels,
            mode: 'markers',
            marker: {
                size: result.sample_values,
                color: result.otu_ids,
                colorscale: "continent",
            }
        };

        var data = [trace1];

        var layout = {
            title: '<b>Bacteria Cultures Per Sample',
            xaxis: { title: "OTU ID" },
            showlegend: false,
            height: 600,
            width: 1200
        };

        Plotly.newPlot('bubbleDiv', data, layout);

        // Gauge Chart

        var washFreq = parseInt(result.wfreq);
        var data = [
            {
                value: washFreq,
                title: { text: "<b>Belly Button Washing Frequency</b><br>Scubs per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [0, 10] },
                    steps: [
                        { range: [0, 2], color: "#ea2c2c" },
                        { range: [2, 4], color: "#ea822c" },
                        { range: [4, 6], color: "#ee9c00" },
                        { range: [6, 8], color: "#eecc00" },
                        { range: [8, 10], color: "#d4ee00" }
                    ]
                }
            }
        ];

        var layout = { width: 600, height: 450 };
        Plotly.newPlot('gaugeDiv', data, layout);
    });
}

