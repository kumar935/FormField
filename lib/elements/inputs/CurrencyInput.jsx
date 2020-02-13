import React from "react";
import FormInput from "./FormInput";
// import "../styles/textinput.scss";
class CurrencyInput extends FormInput {
  // handleInputChange = e => {
  //   let numValue = e.target.value;
  //   let origNumString = numValue;
  //   let onlyDecimalEntered = /\d+\.$/.test(numValue); //for example this value = "1,123." or "21."
  //   numValue =
  //     numValue === ""
  //       ? ""
  //       : Number(
  //           numValue
  //             .toString()
  //             .split(",")
  //             .join("")
  //         );
  //   if (isNaN(numValue)) return;
  //   let commaSeparatedNum = this.getCommaSeparatedNum(numValue);
  //   commaSeparatedNum = onlyDecimalEntered
  //     ? `${commaSeparatedNum}.`
  //     : commaSeparatedNum;



  //   if (this.props.config.sizeRange) {
  //     let max = this.props.config.sizeRange[1];
  //     if (max !== -1 && String(numValue).split(".")[0].length > max) {
  //       return;
  //     }
  //   }
  //   if (this.props.config.minMax) {
  //     let max = this.props.config.minMax[1];
  //     if (numValue > max) return;
  //   }


  //   this.props.onInputChange({
  //     value: numValue,
  //     label: commaSeparatedNum
  //   });
  // };

  handleInputChange = e => {
    let numValue = e.target.value;
    if(numValue === '') {
      return this.props.onInputChange({
        value: '',
        label: ''
      });
    }
    let finalNum = '';
    let onlyDecimalEntered = /\d+\.$/.test(numValue);

    let leadingDigits = numValue.split(".")[0];
    let decimalDigits = numValue.split(".")[1];

    //convert number or number with digits to number
    leadingDigits = Number(
      leadingDigits
        .toString()
        .split(",")
        .join("")
    );
    //full numeric value
    numValue = Number(`${leadingDigits}.${decimalDigits || '0'}`);

    if (isNaN(`${leadingDigits}.${decimalDigits || '0'}`)) return;

    let commaSeparatedLeadingDigits = this.getCommaSeparatedNum(leadingDigits);

    finalNum = onlyDecimalEntered
      ? `${commaSeparatedLeadingDigits}.`
      : '';

    finalNum = `${commaSeparatedLeadingDigits}${onlyDecimalEntered ? '.' : ''}${decimalDigits ? `.${decimalDigits}` : ''}`

    //validations
    if (this.props.config.sizeRange) {
      let max = this.props.config.sizeRange[1];
      if (max !== -1 && String(numValue).split(".")[0].length > max) {
        return;
      }
    }
    if (this.props.config.minMax) {
      let max = this.props.config.minMax[1];
      if (numValue > max) return;
    }

    this.props.onInputChange({
      value: numValue,
      label: finalNum
    });

  };

  getCommaSeparatedNum = num => {
    // return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num.toLocaleString("en-US", { maximumSignificantDigits: 20 });
  };

  valueModifier = num => {
    return {
      label: this.getCommaSeparatedNum(num),
      value: num
    };
  };

  focus() {
    this.input.current.focus();
  }

  render() {
    let {
      config,
      value = {},
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
            ...(config.hideLabel ? { visibility: "hidden" } : {}),
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
          value={value.label || ""}
          error={error.toString()}
          className="form-control"
          ref={this.input}
          autoComplete="off"
          onChange={this.handleInputChange}
          required
          {...rest}
        />
        <span className="error">{errorMsg}</span>
        {config.loading ? <span className="c-three-dots-loader" /> : ""}
      </div>
    );
  }
}

export default CurrencyInput;
