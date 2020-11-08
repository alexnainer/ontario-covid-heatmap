import React, { Component } from "react";
import MapOptions from "./MapOptions";
import mapboxgl from "mapbox-gl";
import "./MapContainer.css";
import phuApi from "../../api/phuApi";
import CircularProgress from "@material-ui/core/CircularProgress";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
let map;

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heatMapData: [],
      loading: true,
      options: {
        gender: "all",
        outcome: "all",
        age: "all",
      },
    };
  }

  async componentDidMount() {
    const { data } = await phuApi.getHeatMap(this.state.options);
    console.log("data", data);
    this.setState({ heatMapData: data, loading: false });

    map = new mapboxgl.Map({
      center: [-79.3832, 43.6532],
      zoom: 7,
      maxZoom: 11,
      minZoom: 4,
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
    });


    map.on("load", function () {
      map.resize();

      map.addSource("phu", {
        type: "geojson",
        data,
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "phu",
        filter: ["has", "caseNum"],
        layout: {
          "text-field": "{caseNum}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": ["step", ["zoom"], 0, 7.5, 12],
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      map.addLayer(
        {
          id: "phu-heat",
          type: "heatmap",
          source: "phu",
          paint: {
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", "caseNumNormalized"],
              0.25,
              5,
              0.5,
              10,
              0.75,
              20,
              1.0,
              40,
            ],

            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              1,
              9,
              3,
            ],

            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0.0,
              "rgba(0,0,255,0)",
              1.0,
              "rgb(0,0,255)",
            ],

            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              [
                "interpolate",
                ["linear"],
                ["get", "caseNumNormalized"],
                0.10,
              18,
              0.20,
              23,
              0.30,
              28,
              0.40,
              33,
              0.50,
              39,
              0.60,
              45,
              0.70,
              51,
              1.0,
              55
              ],
              100,
              [
                "interpolate",
                ["linear"],
                ["get", "caseNumNormalized"],
                0.10,
              16,
              0.20,
              21,
              0.30,
              26,
              0.40,
              31,
              0.50,
              37,
              0.60,
              43,
              0.70,
              49,
              1.0,
              53
              ],
            ],

            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              6,
              1,
              8,
            ],

            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              5,
              1,
              7,
              0,
            ],
          },
        },
        "waterway-label"
      );

      map.addLayer(
        {
          id: "phu-point",
          type: "circle",
          source: "phu",
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "caseNumNormalized"],
              0.10,
              18,
              0.20,
              23,
              0.30,
              28,
              0.40,
              33,
              0.50,
              39,
              0.60,
              45,
              0.70,
              51,
              1.0,
              55
            ],

            "circle-color": [
              "interpolate",
              ["linear"],
              ["get", "caseNumNormalized"],
              0.05,
              "rgb(0,102,0)",
              0.1,
              "rgb(220,220,32)",
              0.2,
              "rgb(255,128,0)",
              0.8,
              "rgb(220,69,0)",
              0.99,
              "rgb(112,0,0)",
            ],
            "circle-stroke-color": "white",
            "circle-stroke-width": 0,
            "circle-opacity": ["interpolate", ["linear"], ["zoom"], 5, 0, 7, 1],
          },
        },
        "waterway-label"
      );
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
        });
  
        map.on('mouseenter', 'phu-point', function (e) {
          map.getCanvas().style.cursor = 'pointer';
           
          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = "<h6>Public Health Unit:</h6>" + "<p1>" + e.features[0].properties.healthUnit + "</p1>" +"<h6 padding=4px>Case Number:</h6>" +  "<p1>" + e.features[0].properties.caseNum + "</p1>";
           
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
           
          popup.setLngLat(coordinates).setHTML(description).addTo(map);
          });
           
          map.on('mouseleave', 'phu-point', function () {
          map.getCanvas().style.cursor = '';
          popup.remove();
          });
  
          map.on('mouseleave', 'phu-point', function () {
            map.getCanvas().style.cursor = '';
            popup.remove();
            });
    });


    
  }

  handleOptionChange = async (field, value) => {
    await this.setState({
      options: {
        ...this.state.options,
        [field]: value,
      },
      loading: true,
    });
    const { data } = await phuApi.getHeatMap(this.state.options);
    map.getSource("phu").setData(data);
    this.setState({ heatMapData: data, loading: false });
  };

  render() {
    return (
      <div>
        <MapOptions
          options={this.state.options}
          handleOptionChange={this.handleOptionChange}
        />
        <div className="d-flex justify-content-center align-items-center">
          {this.state.loading && (
            <div className="loading position-absolute d-flex justify-content-center align-items-center">
              <CircularProgress />
            </div>
          )}
          <div className="map-container">
            <div
              ref={(el) => (this.mapContainer = el)}
              id="map"
              className="map"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MapContainer;
