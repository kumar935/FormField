import React from "react";
import TextInput from "./TextInput";

class OtpInput extends TextInput {
  constructor(props) {
    super(props);
  }
  handleInputChange = e => {
    let newValue = e.target.value;

    if (isNaN(newValue.substr(4))) return;
    if (this.props.config.decimalsAllowed) {
      if (
        String(newValue).split(".")[1] &&
        String(newValue).split(".")[1].length >
          this.props.config.decimalsAllowed
      )
        return;
    }
    if (this.props.config.sizeRange) {
      let max = this.props.config.sizeRange[1];
      if (max !== -1 && String(newValue).split(".")[0].length > max) {
        return;
      }
    }
    if (this.props.config.minMax) {
      let max = this.props.config.minMax[1];
      if (newValue > max) return;
    }
    this.props.onInputChange(newValue);
  };
}

export default OtpInput;
