function init() {

    var dropdownMenu = d3.select("#selDataset");

    d3.json("data/samples.json").then((data) => {

        data.names.forEach((i) => {
            dropdownMenu.append("option").text(i).property("value");
        });

        selectPlot(data.names[0]);
        selectDemographics(data.names[0]);
    });
};

function selectPlot(id) {
    
    d3.json("data/samples.json").then((data)=> {

        var samples = data.samples.filter(b => b.id == id)[0];
        
        var sample_values = samples.sample_values.slice(0, 10).reverse();

        var otu_ids = (samples.otu_ids.slice(0, 10)).reverse();
        
        var otu_ids_clean = otu_ids.map(c => "OTU " + c)

        var otu_labels = samples.otu_labels.slice(0, 10);

        console.log(`Id Values: ${otu_ids_clean}`)
        console.log(`Sample Values: ${sample_values}`)

        var trace1 = {
            type:"bar",
            orientation: "h",
            x: sample_values,
            y: otu_ids_clean,
            text: otu_labels,
        };

        var data = [trace1];

        var layout = {
            title: "Top 10 Bacteria Cultures Found",
            yaxis: {tickmode:"linear"},
            width: 800,
            height: 600,
            margin: {
                l: 80,
                r: 10,
                t: 50,
                b: 30
            }
        };

        Plotly.newPlot("bar", data, layout);
        
        var trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };

        var layout = {
            title: "Bacteria Cultures per Sample",
            xaxis: {title: "OTU ID"},
            height: 700,
            width: 1100
        };

        var data = [trace2];

        Plotly.newPlot("bubble", data, layout); 
    });    
};
    
function selectDemographics(id) {

    d3.json("data/samples.json").then((data)=> {
        
        var metadata = data.metadata.filter(d => d.id == id)[0];

        var demographics = d3.select("#sample-metadata");
        
        demographics.html("");

        Object.entries(metadata).forEach(([key,value]) => {   
                demographics.append("h5").text(`${key}: ${value}`);   
        });
    });
};

function optionChanged(id) {
    selectPlot(id);
    selectDemographics(id);
};

init();