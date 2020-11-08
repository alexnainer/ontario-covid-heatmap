import React, { Component } from "react";
import MapOptions from "./MapOptions";
import mapboxgl from "mapbox-gl";
import "./MapContainer.css";
import phuApi from "../../api/phuApi";

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
        id: 'cluster-count',
        type: 'symbol',
        source: 'phu',
        filter: ['has', 'caseNum'],
        layout: {
        'text-field': '{caseNum}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': [
          'step',
          ["zoom"],
          0,
          7,
          12
        ]
        },
        paint: {
          "text-color": "#ffffff"
        }
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
              ["get", "caseNum"],
                100,
                5,
                1000,
                10,
                5000,
                20,
                10000,
                40,
                20000,
                60
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
              ['zoom'],
              0, 
              [
                'interpolate',
                ['linear'],
                ["get", "caseNum"],
                100,
                20,
                1000,
                25,
                5000,
                30,
                10000,
                35,
                20000,
                40
              ],
              100, [
              'interpolate',
              ['linear'],
              ["get", "caseNum"],
              100,
              18,
              1000,
              23,
              5000,
              28,
              10000,
              33,
              20000,
              38
              ]
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

            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
                5,
                1,
                7,
                0
              ]
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
                ['get', 'caseNum'],
                100,
                18,
                1000,
                23,
                5000,
                28,
                10000,
                33,
                20000,
                38
            ],

            "circle-color": [
              "interpolate",
              ["linear"],
              ["get", "caseNum"],
              100,
              "rgb(0,102,0)",
              1000,
              "rgb(0,153,0)",
              5000,
              "rgb(204,204,0)",
              10000,
              "rgb(255,128,0)",
              15000,
              "rgb(255,0,0)",
              20000,
              "rgb(204,0,0)",
            ],
            "circle-stroke-color": "white",
            "circle-stroke-width": 0,
            "circle-opacity": ["interpolate", ["linear"], ["zoom"], 5, 0, 7, 1],
          },
        },
        "waterway-label"
      );
    });
  
  }

  handleGenderChange = async (event) => {
    await this.setState({
      options: { ...this.state.options, gender: event.target.value },
    });
    const data = await phuApi.getHeatMap(this.state.options);
    this.setState({ data });
  };

  handleOutcomeChange = async (event) => {
    await this.setState({
      options: { ...this.state.options, outcome: event.target.value },
    });
    const data = await phuApi.getHeatMap(this.state.options);
    this.setState({ data });
  };

  handleAgeChange = async (event) => {
    await this.setState({
      options: { ...this.state.options, age: event.target.value },
    });
    const data = await phuApi.getHeatMap(this.state.options);
    this.setState({ data });
  };

  render() {
    return (
      <div>
        <MapOptions
          options={this.state.options}
          handleGenderChange={this.handleGenderChange}
          handleOutcomeChange={this.handleOutcomeChange}
          handleAgeChange={this.handleAgeChange}
        />
        <div className="d-flex justify-content-center">
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
