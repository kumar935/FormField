import React from "react";
import FormInput from "./FormInput";

class NestedSelectInput extends FormInput {
  constructor(props) {
    super(props);
    this.state = {
      menuIsOpen: false,
      value: "",
      values: [],
      filteredOptions: props.config.options,
      selectableOptions: props.config.options
    };
  }

  onClickOpt = (e, selectedOpt) => {
    this.setState({ value: selectedOpt.label }, () => {
      this.props.onInputChange(selectedOpt.value);
    });
  };

  updateFilteredOptionsList() {
    let { value, selectableOptions } = this.state;
    this.setState({
      filteredOptions: selectableOptions.filter(
        opt => opt.value.indexOf(value) === 0
      )
    });
  }

  handleInputChange = e => {
    let { value } = e.target;
    this.setState(
      {
        value
      },
      () => this.updateFilteredOptionsList()
    );
  };

  render() {
    let { menuIsOpen, filteredOptions, values } = this.state;
    let { config, value } = this.props;
    return (
      <div
        className="nselect-container"
        tabIndex="0"
        onFocus={() => this.setState({ menuIsOpen: true })}
        onBlur={() => this.setState({ menuIsOpen: false })}
        style={{ outline: "none" }}
      >
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleInputChange}
        />
        <input type="text" value={value} style={{ display: "none" }} />
        <div
          className="nselect-options"
          style={{ display: menuIsOpen ? "block" : "none" }}
        >
          {filteredOptions.map(opt => (
            <div className="opt" onClick={e => this.onClickOpt(e, opt)}>
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default NestedSelectInput;
