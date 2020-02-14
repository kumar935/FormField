import React from "react";
import FormInput from "./FormInput";
import { InputWrapper, Line, Input, Label, styleDefaults } from "../StyledElements";
// import "../styles/textinput.scss";

class TextInput extends FormInput {
  static defaults = {
    styles: styleDefaults
  }
  handleInputChange = e => {
    let newValue = e.target.value;
    if (this.props.config.sizeRange) {
      let max = this.props.config.sizeRange[1];
      if (max !== -1 && String(newValue).split(".")[0].length > max) {
        return;
      }
    }
    if (
      this.props.config.allowedSizes &&
      this.props.config.allowedSizes.length !== 0
    ) {
      let largest = Math.max(...this.props.config.allowedSizes);
      if (String(newValue).length > largest) return;
    }
    this.props.onInputChange(newValue);
  };

  focus() {
    this.input.current.focus();
  }
  onCutCopyPaste = e => {
    if (this.props.config.preventCutCopyPaste === true) e.preventDefault();
  };

  render() {
    let {
      config,
      value,
      error,
      onRef,
      errorMsg,
      onChange,
      onInputChange,
      ...rest
    } = this.props;
    return (
      <InputWrapper
        className={`ff-txt ${config.containerClass || ""}`}
        style={{ position: "relative" }}
      >
        <Input
          autoComplete="off"
          className="form-control"
          dir={config.dir}
          error={error.toString()}
          name={config.label}
          onChange={this.handleInputChange}
          ref={this.input}
          required
          type={
            config.type === "text" || config.type === "number"
              ? "text"
              : config.type
          }
          value={value}
          {...rest}
          onCopy={this.onCutCopyPaste}
          onCut={this.onCutCopyPaste}
          onPaste={this.onCutCopyPaste}
          placeholder={config.placeholder}
        />
        <Label
          htmlFor={this.props.id}
          className="ff-label"
          style={{
            ...(config.hideLabel ? { display: "none" } : {}),
            ...(!config.label ? { display: "none" } : {})
          }}
        >
          {this.props.config.label || ""}
        </Label>
        <span className="error">{errorMsg}</span>
        {config.loading ? <span className="c-three-dots-loader" /> : ""}
        {config.posRightBtn &&
        (config.posRightBtn.text ||
          config.posRightBtn.element ||
          config.posRightBtn.domClass) ? (
          <Label
            className={`position-right ${config.posRightBtn.domClass || ""}`}
            onClick={config.posRightBtn.onClick}
          >
            {config.posRightBtn.text || config.posRightBtn.element || ""}
          </Label>
        ) : (
          ""
        )}
        <Line className="line" color={TextInput.defaults.color}/>
      </InputWrapper>
    );
  }
}

export default TextInput;
