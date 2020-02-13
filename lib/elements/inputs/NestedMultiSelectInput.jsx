import React from "react";
import FormInput from "./FormInput";

class NestedMultiSelectInput extends FormInput {
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
    this.setState(
      prevState => ({
        menuIsOpen: false,
        ...{
          values: [...prevState.values, selectedOpt],
          selectableOptions: prevState.selectableOptions.filter(
            opt => opt.value !== selectedOpt.value
          )
        }
      }),
      () => {
        this.props.onInputChange(this.state.values);
        this.updateFilteredOptionsList();
      }
    );
  };

  onClickRemoveTag = (e, tag) => {
    this.setState(
      prevState => ({
        values: prevState.values.filter(v => v.value !== tag.value),
        selectableOptions: [...prevState.selectableOptions, tag]
      }),
      () => this.updateFilteredOptionsList()
    );
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

  onKeyPressInput = e => {
    if (e.which === 8) {
      if (e.target.value === "") {
        let { values } = this.state;
        this.onClickRemoveTag({}, values[values.length - 1])
      }
    }
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
        <div className="inputholder">
          {values.map(tag => (
            <span className="tag" onClick={e => this.onClickRemoveTag(e, tag)}>
              {tag.label}
            </span>
          ))}
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleInputChange}
            onKeyDown={this.onKeyPressInput}
          />
        </div>
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

export default NestedMultiSelectInput;
