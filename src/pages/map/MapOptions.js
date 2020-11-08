import React, { Component } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

class MapOptions extends Component {
  render() {
    const { options } = this.props;
    return (
      <div>
        <div className="row justify-content-center pb-2">
          <div className="col-auto">
            <FormControl>
              <InputLabel>Gender</InputLabel>
              <Select
                value={options.gender}
                onChange={(e) =>
                  this.props.handleOptionChange("gender", e.target.value)
                }
              >
                <MenuItem value={"all"}>All</MenuItem>
                <MenuItem value={"MALE"}>Male</MenuItem>
                <MenuItem value={"FEMALE"}>Female</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="col-auto">
            <FormControl>
              <InputLabel>Outcome</InputLabel>
              <Select
                value={options.outcome}
                onChange={(e) =>
                  this.props.handleOptionChange("outcome", e.target.value)
                }
              >
                <MenuItem value={"all"}>Total</MenuItem>
                <MenuItem value={"Resolved"}>Resolved</MenuItem>
                <MenuItem value={"Not Resolved"}>Active</MenuItem>
                <MenuItem value={"Fatal"}>Fatal</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="col-auto">
            <FormControl>
              <InputLabel>Age</InputLabel>
              <Select
                value={options.age}
                onChange={(e) =>
                  this.props.handleOptionChange("age", e.target.value)
                }
              >
                <MenuItem value={"all"}>All</MenuItem>
                <MenuItem value={"<20"}>{"<20"}</MenuItem>
                <MenuItem value={"20s"}>20-29</MenuItem>
                <MenuItem value={"30s"}>30-39</MenuItem>
                <MenuItem value={"40s"}>40-49</MenuItem>
                <MenuItem value={"50s"}>50-59</MenuItem>
                <MenuItem value={"60s"}>60-69</MenuItem>
                <MenuItem value={"70s"}>70-79</MenuItem>
                <MenuItem value={"80s"}>80-89</MenuItem>
                <MenuItem value={"90s"}>90-99</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
    );
  }
}

export default MapOptions;
