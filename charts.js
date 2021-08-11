function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var result_array = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = result_array[0];

    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);


    // Create a variable that holds the first sample in the metadata array.
    var meta_result = resultArray[0];

    // Create a variable that holds the washing frequency.
    var wash_freq = meta_result.wfreq;

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_Ids = result.otu_ids;
    var otu_Labels = result.otu_labels;
    var otu_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_Ids.slice(0,10).reverse().map(ids => "OTU"+ids);
    

    // 8. Create the trace for the bar chart. 
    var barData = {
        x: otu_values.slice(0,10).reverse(),
        y: yticks,
        type: "bar",
        text: otu_Labels.slice(0,10).reverse(),
        orientation: "h"
          
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout)


    
    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_Ids,
      y: otu_values,
      text: otu_Labels,
      mode: "markers",
      marker: {
        size: otu_values,
        color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)', "blue", "red", "yellow","green", "gray", "cyan" ]
      }
  };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: 'OTU ID'},
      showlegend: false,
      height: 600,
      width: 1200
      
    };
    // 3. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("bubble", [bubbleData],bubbleLayout);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = {
      value: wash_freq,
      type: "indicator",
      title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
      mode: "gauge+number",
      gauge: {
        axis: {range: [0,10]},
        steps: [
          {range: [0,2], color: "blue"},
          {range: [2,4], color: "yellow"},
          {range: [4,6], color: "red"},
          {range: [6,8], color: "lightgray"},
          {range: [8,10], color: "orange"}
        ]
      }
     
    };
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, height: 450, margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData],gaugeLayout);
  
  });
}
