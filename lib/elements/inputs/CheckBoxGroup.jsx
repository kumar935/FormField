import React from "react";
import FormInput from "./FormInput";
import "../../styles/toggle.css"

class CheckBoxGroup extends FormInput {
  state = {};

  componentDidMount = () => {
    super.componentDidMount();
    let { options } = this.props.config;
    options = options.map(opt => ({ checked: false, ...opt }));
    this.props.onInputChange(options, true); // shouldn't trigger the user onChange first time so passed true, hope it doesn't break anything.
  };

  onChangeCheckBox = e => {
    let { options } = this.props.config;
    options = options.map(opt => {
      if (opt.value == e.target.value) {
        opt.checked = e.target.checked;
      }
      return opt;
    });
    this.props.onInputChange(options);
  };

  focus() {
    this.input.current.focus();
  }
  render() {
    let { config, value, error, ref, errorMsg, ...rest } = this.props;
    let options = config.options || [];
    return (
      <div
        className={`${config.containerClass || ""} ${
          config.loading ? "input-loading" : ""
        } checkbox-group`}
        style={{
          flexDirection: "row",
          justifyContent: "space-around"
        }}
      >
        {options.map(opt => (
          <label className="toggle">
            <span>
              {typeof opt.label === "object"
                ? opt.label[opt.checked]
                : opt.label}
              &nbsp;&nbsp;&nbsp;
            </span>
            <input
              className="tgl tgl-theme"
              type="checkbox"
              value={opt.value}
              checked={opt.checked}
              onChange={this.onChangeCheckBox}
            />
            <span className="tgl-btn" />
          </label>
        ))}
        <span className="error">{errorMsg}</span>
      </div>
    );
  }
}

export default CheckBoxGroup;
