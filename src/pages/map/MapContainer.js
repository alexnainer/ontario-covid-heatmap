import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import "./MapContainer.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
let map;

class MapContainer extends Component {
  componentDidMount() {
    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
    });

    map.on("load", function () {
      map.resize();
    });
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <div className="map-container">
          <div
            ref={(el) => (this.mapContainer = el)}
            id="map"
            className="map"
          />
        </div>
      </div>
    );
  }
}

export default MapContainer;
