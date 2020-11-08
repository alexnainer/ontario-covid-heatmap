import React, { Component } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

class MapSourceOptions extends Component {
  render() {
    const { source } = this.props;
    return (
      <div className={this.props.className}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Data Set</FormLabel>
          <RadioGroup
            value={source}
            onChange={(e) => this.props.handleSourceChange(e.target.value)}
          >
            <FormControlLabel
              value="psu"
              control={<Radio />}
              label="Public Health Units"
            />
            <FormControlLabel
              value="schools"
              control={<Radio />}
              label="Schools"
            />
            <FormControlLabel
              disabled
              value="ltr"
              control={<Radio />}
              label="LTR"
            />
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

export default MapSourceOptions;
