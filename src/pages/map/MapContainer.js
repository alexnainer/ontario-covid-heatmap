import React, { Component } from "react";
import ReactDOM from "react-dom";
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

  componentDidUpdate() {
    console.log("didUpdate");
    map.on("load", function () {
      map.resize();
    });
  }

  render() {
    return <div ref={(el) => (this.mapContainer = el)} id="map" />;
  }
}

export default MapContainer;
