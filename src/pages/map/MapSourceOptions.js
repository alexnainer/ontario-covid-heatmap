import React, { Component } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

class MapSourceOptions extends Component {
  render() {
    const { source, disabled } = this.props;
    return (
      <div className={this.props.className}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Data Set</FormLabel>
          <RadioGroup
            disabled={disabled}
            value={source}
            onChange={(e) => this.props.handleSourceChange(e.target.value)}
          >
            <FormControlLabel
              disabled={disabled}
              value="psu"
              control={<Radio />}
              label="Public Health Units"
            />
            <FormControlLabel
              disabled={disabled}
              value="schools"
              control={<Radio />}
              label="Schools"
            />
            <FormControlLabel
              value="ltr"
              disabled={disabled}
              control={<Radio />}
              label="LTR"
            />
            <FormControlLabel
              value="childCare"
              disabled={disabled}
              control={<Radio />}
              label="LCC"
            />
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

export default MapSourceOptions;
