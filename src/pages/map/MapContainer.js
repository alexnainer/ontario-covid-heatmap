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
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
    });

    map.on("load", function () {
      map.resize();

      map.addSource("phu", {
        type: "geojson",
        data,
      });

      map.addLayer(
        {
          id: "phu-heat",
          type: "heatmap",
          source: "phu",
          // maxzoom: 9,
          paint: {
            // Increase the heatmap weight based on frequency and property magnitude
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", "caseNum"],
              0,
              0,
              6,
              5,
            ],
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              1,
              9,
              3,
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(33,102,172,0)",
              0.2,
              "rgb(103,169,207)",
              0.4,
              "rgb(209,229,240)",
              0.6,
              "rgb(253,219,199)",
              0.8,
              "rgb(239,138,98)",
              1,
              "rgb(178,24,43)",
            ],
            // Adjust the heatmap radius by zoom level
            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              2,
              9,
              20,
            ],
            // Transition from heatmap to circle layer by zoom level
            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              1,
              9,
              0,
            ],
          },
        },
        "waterway-label"
      );

      // map.addLayer(
      //   {
      //     id: "phu-point",
      //     type: "circle",
      //     source: "phu",
      //     minzoom: 7,
      //     paint: {
      //       // Size circle radius by earthquake magnitude and zoom level
      //       "circle-radius": [
      //         "interpolate",
      //         ["linear"],
      //         ["zoom"],
      //         7,
      //         ["interpolate", ["linear"], ["get", "caseNum"], 1, 1, 6, 4],
      //         16,
      //         ["interpolate", ["linear"], ["get", "caseNum"], 1, 5, 6, 50],
      //       ],
      //       // Color circle by earthquake magnitude
      //       "circle-color": [
      //         "interpolate",
      //         ["linear"],
      //         ["get", "mag"],
      //         1,
      //         "rgba(33,102,172,0)",
      //         2,
      //         "rgb(103,169,207)",
      //         3,
      //         "rgb(209,229,240)",
      //         4,
      //         "rgb(253,219,199)",
      //         5,
      //         "rgb(239,138,98)",
      //         6,
      //         "rgb(178,24,43)",
      //       ],
      //       "circle-stroke-color": "white",
      //       "circle-stroke-width": 1,
      //       // Transition from heatmap to circle layer by zoom level
      //       "circle-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 8, 1],
      //     },
      //   },
      //   "waterway-label"
      // );
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
