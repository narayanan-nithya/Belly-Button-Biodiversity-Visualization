    
      var data;

      function init(){
        d3.json("samples.json").then((bdata) => { 
          data = bdata;

          var all_names = bdata.names;
          var optionselected = d3.select("#selDataset");
          all_names.forEach(value => {
            optionselected.append("option")
              .text(value)
              .attr("value", function() {
                return value;
              });
          });
        });
      }
      init();
      d3.selectAll("#selDataset").on("change", optionChanged());
        // Set up default plot
        // Function for updating plots   
      function optionChanged () {
          var plotvalues = d3.select("#selDataset").node().value;
          demographicinfo(plotvalues);
          metainfo(plotvalues);
          demographicinfo(plotvalues);
          bubbleChart(plotvalues);
        }
      function metainfo(plotvalues) {
         
          var filtereddata1 = data.metadata.filter(value => value.id == plotvalues);
        
          var divValue = d3.select(".panel-body");
          divValue.html("");
          divValue.append("p").text(`id: ${filtereddata1[0].id}`);
          divValue.append("p").text(`ethnicity: ${filtereddata1[0].ethnicity}`);
          divValue.append("p").text(`gender: ${filtereddata1[0].gender}`);
          divValue.append("p").text(`age: ${filtereddata1[0].age}`);
          divValue.append("p").text(`location: ${filtereddata1[0].location}`);
          divValue.append("p").text(`bbtype: ${filtereddata1[0].bbtype}`);
          divValue.append("p").text(`wfreq: ${filtereddata1[0].wfreq}`);
        }

      function demographicinfo(plotvalues) {
          var filterereddata2 = data.samples.filter(value => value.id == plotvalues);
          var otuid = filterereddata2.map(v => v.otu_ids);
          otuid = otuinfo(otuid[0].slice(0, 10));
          var sampleval = filterereddata2.map(v => v.sample_values);
          sampleval = sampleval[0].slice(0, 10);
        
          var otulables = filterereddata2.map(v => v.otu_labels);
          var names = bacnameinfo(otulables[0]).slice(0, 10);
        
          // Create the Trace
          var trace = {
            x: sampleval,
            y: otuid,
            text: names,
            type: "bar",
            orientation: "h"
          };
        
          var layout = {
            title: "Top 10 OTU's Data Graph", 
            yaxis: {
              autorange: "reversed"
            }
          };
        
          // Create the data array for the plot
          var plotteddata = [trace];
        
          // Plot the chart to a div tag with id "bar-plot"
          Plotly.newPlot("bar", plotteddata, layout);
        }

      function bubbleChart(plotvalues) {
          var filtereddata3 = data.samples.filter(value => value.id == plotvalues);
          var otuid2 = filtereddata3.map(v => v.otu_ids);
          otuid2 = otuid2[0];
          var samplabel2 = filtereddata3.map(v => v.sample_values);
          samplabel2 = samplabel2[0];
        
          var otulables2 = filtereddata3.map(v => v.otu_labels);
          otulables2 = bacnameinfo(otulables2[0]);
        
          var trace2 = {
            x: otuid2,
            y: samplabel2,
            mode: "markers",
            marker: {
              color: otuid2,
              size: samplabel2
            },
            text: otulables2
          };
        
          var plotteddata2 = [trace2];
        
          var layout = {
            showlegend: false,
            xaxis: { title: "OTU Data Bubble Chart" }
          };
        
          Plotly.newPlot("bubble", plotteddata2, layout);
        }

      function bacnameinfo(name) {
          var baclist = [];
        
          for (var i = 0; i < name.length; i++) {
            var name_str = name[i].toString();
            var name_splt = name_str.split(";");
            if (name_splt.length > 1) {
              baclist.push(name_splt[name_splt.length - 1]);
            } else {
              baclist.push(name_splt[0]);
            }
          }
          return baclist;
        }
        
      function otuinfo(name) {
          var otuid_list = [];
          for (var i = 0; i < name.length; i++) {
            otuid_list.push(`OTU ${name[i]}`);
          }
          return otuid_list;
        }
        
         