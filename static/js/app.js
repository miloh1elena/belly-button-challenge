// Define a function to fetch and process data
function fetchData(selectedId) {
    // Define the URL of the JSON file
    const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
  
    // Use D3 to fetch the JSON data
    d3.json(url).then(function(data) {
      // Extract sample data
      const samples = data.samples;
  
      // Find the selected sample data
      const selectedSample = samples.find(sample => sample.id === selectedId);
  
      // Extract the top 10 OTUs
      const top10SampleValues = selectedSample.sample_values.slice(0, 10);
      const top10OtuIds = selectedSample.otu_ids.slice(0, 10);
      const top10OtuLabels = selectedSample.otu_labels.slice(0, 10);
  
      // Create the bar chart
      createBarChart(top10SampleValues, top10OtuIds, top10OtuLabels, selectedId);
  
      // Create the bubble chart
      createBubbleChart(selectedSample.otu_ids, selectedSample.sample_values, selectedSample.otu_labels, selectedId);
  
      // Display the sample metadata
      displayMetadata(data.metadata, selectedId);
    }).catch(function(error) {
      console.error("Error fetching data:", error);
    });
  }
  
  // Define a function to create a horizontal bar chart
  function createBarChart(sampleValues, otuIds, otuLabels, selectedId) {
    const trace = {
      x: sampleValues,
      y: otuIds.map(otuId => `OTU ${otuId}`),
      text: otuLabels,
      type: "bar",
      orientation: "h"
    };
  
    const data = [trace];
  
    const layout = {
      title: `Top 10 OTUs for Subject ${selectedId}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" }
    };
  
    Plotly.newPlot("bar", data, layout);
  }
  
  // Define a function to create a bubble chart
  function createBubbleChart(otuIds, sampleValues, otuLabels, selectedId) {
    const trace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth',
        opacity: 0.6
      }
    };
  
    const data = [trace];
  
    const layout = {
      title: `Bubble Chart for Subject ${selectedId}`,
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" },
      showlegend: false
    };
  
    Plotly.newPlot("bubble", data, layout);
  }
  
  // Define a function to display sample metadata
  function displayMetadata(metadata, selectedId) {
    // Find the selected metadata
    const selectedMetadata = metadata.find(entry => entry.id === parseInt(selectedId));
  
    // Select the sample metadata div
    const metadataDiv = d3.select("#sample-metadata");
  
    // Clear existing metadata
    metadataDiv.html("");
  
    // Iterate through the selected metadata and display key-value pairs
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      metadataDiv.append("p").text(`${key}: ${value}`);
    });
  }
  
  // Define a function to handle dropdown change
  function optionChanged(selectedId) {
    fetchData(selectedId);
  }
  
  // Initialize the dropdown menu
  function init() {
    // Define the URL of the JSON file
    const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
  
    const dropdownMenu = d3.select("#selDataset");
  
    // Populate the dropdown menu with subject IDs
    d3.json(url).then(function(data) {
      const sampleNames = data.names;
      sampleNames.forEach(sample => {
        dropdownMenu.append("option").text(sample).property("value", sample);
      });
  
      // Call the fetchData function to update all plots with the first sample
      const initialId = sampleNames[0];
      fetchData(initialId);
    }).catch(function(error) {
      console.error("Error fetching data:", error);
    });
  }
  
  // Call the init function to initialize the dropdown
  init();
  