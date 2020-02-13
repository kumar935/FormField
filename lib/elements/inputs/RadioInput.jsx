import React from "react";
import FormInput from "./FormInput";
import Select from "react-select";

class RadioInput extends FormInput {
  handleRadioChange = changeEvent => {
    let newValue = changeEvent.target.value;
    if (newValue === "true") newValue = true;
    if (newValue === "false") newValue = false;
    let valObj = this.props.config.options.find(v => v.value == newValue);
    this.props.onInputChange(valObj);
  };

  componentDidUpdate(prevProps, prevState) {
    let { options } = this.props.config;
    let { value = {} } = this.props;
    if (
      value !== "" &&
      typeof value !== "object" &&
      options.find(opt => value == opt.value)
    ) {
      let newVal = this.valueModifier(value);
      if (prevProps.value !== newVal.value)
        this.props.onInputChange(newVal, false);
      //selecting the value that was set before options were populated
    }
  }
  componentDidMount() {
    let { options } = this.props.config;
    let { value = {} } = this.props;
    if (
      value !== "" &&
      typeof value !== "object" &&
      options.find(opt => value == opt.value)
    ) {
      let newVal = this.valueModifier(value);
      this.props.onInputChange(newVal, false);
      //selecting the value that was set before options were populated
    }
  }
  valueModifier = value => {
    let { options } = this.props.config;
    let selectedOption;
    options.map(option => {
      if (option.value == value) {
        selectedOption = option;
      }
    });
    return selectedOption;
  };

  render() {
    let { config, value, error, errorMsg, disabled, ...rest } = this.props;
    value = value || {};
    config.options = config.options || [
      {
        label: "Yes",
        value: config.booleanYN ? "Y" : true
      },
      {
        label: "No",
        value: config.booleanYN ? "N" : false
      }
    ];
    return (
      <div
        className={`form-field-wrapper radio-group ${config.containerClass ||
          ""}`}
      >
        {config.label && !config.hideLabel ? <label>{config.label}</label> : ""}
        <div className="radio-group-wraper">
          {config.options.map((option, i) => (
            <React.Fragment key={`radio-option-${i}`}>
              <label className="radio-inline">
                <input
                  type="radio"
                  id={option.label}
                  value={option.value}
                  checked={value.value == option.value}
                  onChange={this.handleRadioChange}
                  onFocus={this.props.onFocus}
                  onBlur={this.props.onBlur}
                  disabled={disabled}
                />
                <span>{option.label}</span>
              </label>
              {/*<label className="radioLabel" htmlFor={option.label}>{option.label}</label>*/}
            </React.Fragment>
          ))}
        </div>
        <span className="error">{errorMsg}</span>
      </div>
    );
  }
}

export default RadioInput;
