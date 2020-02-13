import React from "react";
import FormInput from "./FormInput";
// import "../styles/textinput.scss";

class TextInput extends FormInput {
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
      <div
        className={`ff-txt ${config.containerClass || ""}`}
        style={{ position: "relative" }}
      >
        <label
          htmlFor={this.props.id}
          className="ff-label"
          style={{
            ...(config.hideLabel ? { display: "none" } : {}),
            ...(!config.label ? { display: "none" } : {})
          }}
        >
          {this.props.config.label || ""}
        </label>
        <input
          type={
            config.type === "text" || config.type === "number"
              ? "text"
              : config.type
          }
          name={config.label}
          value={value}
          error={error.toString()}
          className="form-control"
          ref={this.input}
          autoComplete="off"
          onChange={this.handleInputChange}
          dir={config.dir}
          required
          {...rest}
          placeholder={config.placeholder}
          onCut={this.onCutCopyPaste}
          onCopy={this.onCutCopyPaste}
          onPaste={this.onCutCopyPaste}
        />
        <span className="error">{errorMsg}</span>
        {config.loading ? <span className="c-three-dots-loader" /> : ""}
        {config.posRightBtn &&
        (config.posRightBtn.text ||
          config.posRightBtn.element ||
          config.posRightBtn.domClass) ? (
          <label
            className={`position-right ${config.posRightBtn.domClass || ""}`}
            onClick={config.posRightBtn.onClick}
          >
            {config.posRightBtn.text || config.posRightBtn.element || ""}
          </label>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default TextInput;
