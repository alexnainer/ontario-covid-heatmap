import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

class Header extends Component {
  render() {
    return (
      <div className="d-flex justify-content-center pb-3">
        <h1 className="header px-4">Ontario COVID Heatmap</h1>
        {/* <FontAwesomeIcon icon={faStarOfLife} style={{ color: "red" }} /> */}
      </div>
    );
  }
}

export default Header;
