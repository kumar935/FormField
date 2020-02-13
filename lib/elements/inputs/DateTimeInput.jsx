import React from "react";
import FormInput from "./FormInput";
import moment from "moment";
import DateTime from "react-datetime";
// import "../styles/date-time-picker.scss";
const DEFAULT_FORMAT = "DD-MMM-YY";
const dateValidators = {
  notPast: d => {
    let notPast =
      d.valueOf() >=
      moment()
        .startOf("day")
        .valueOf();
    return notPast;
  },
  notFuture: d => {
    let notFuture =
      d.valueOf() <=
      moment()
        .startOf("day")
        .valueOf();
    return notFuture;
  },
  above18: d => {
    let above18 =
      d.valueOf() <=
      moment()
        .subtract(18, "years")
        .startOf("day")
        .valueOf();
    return above18;
  }
};
const dateValidatorDateView = {
  above18: moment().subtract(18, "years")
};
class DateTimeInput extends FormInput {
  componentDidMount() {
    if (this.props.value)
      // the value passed in props can be timestamp, object, date
      this.props.onInputChange(this.getInputDate({value:this.props.value, acceptTimestamp: true}));
  }
  lastValidDate = ""

  componentDidUpdate(prevProps, prevState) {
    if (typeof this.props.value !== "object" && this.props.value && prevProps.value !== this.props.value) {
      let newVal = this.valueModifier(this.props.value);
      if (newVal != "") {
        this.lastValidDate = newVal;
        this.props.onInputChange(newVal);
      }
    }
  }

  handleInputChange = dateObj => {
    if (typeof dateObj === "object") this.lastValidDate = dateObj; //means datepicker was used
    this.props.onInputChange(dateObj);
  };

  onBlurDateInput = () => {
    if (typeof this.props.value !== "object") {
      this.props.onInputChange(this.lastValidDate);
    }
  };

  inputValidator = value => ({
    valid:
      typeof value === "object" && value instanceof moment && value.isValid(),
    errorMsg: "Please enter valid date"
  });

  valueModifier = value => {
    return this.getInputDate({value, acceptTimestamp: false})
  };

  getInputDate = ({value, acceptTimestamp}) => {
    let { dateFormat } = this.props.config;
    let dateObj;
    dateFormat = dateFormat || DEFAULT_FORMAT;
    if (isNaN(value)) {
      //case when value is not a number so a date string possibly
      dateObj = moment(value, dateFormat, true);
    } else {
      if(acceptTimestamp){ // while entering digits, it will be converted into an unsuitable moment object date
        dateObj = moment(value);
      }
    }
    if (dateObj && dateObj.isValid()) return moment(value);
    return value;
  }

  render() {
    let {
      config,
      value,
      error,
      onRef,
      errorMsg,
      onChange,
      onFocus,
      onBlur,
      onInputChange,
      disabled = false,
      inputProps,
      ...rest
    } = this.props;
    let {
      dateFormat,
      timeFormat,
      placeholder,
      dateValidator,
      isValidDate = () => true,
      ...restConfig
    } = config;
    return (
      <div
        className={`${config.containerClass || ""} ${
          config.loading ? "input-loading" : ""
        } ff-date`}
        tabIndex="-1"
        onBlur={onBlur}
        style={{
          position: "relative"
        }}
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
        <DateTime
          dateFormat={dateFormat}
          timeFormat={timeFormat || false}
          inputProps={{
            name: this.props.config.label,
            placeholder: dateFormat
              ? dateFormat
              : timeFormat
              ? timeFormat
              : DEFAULT_FORMAT,
            disabled: disabled,
            ...inputProps
          }}
          onChange={this.handleInputChange}
          onBlur={this.onBlurDateInput}
          value={value}
          {...(dateValidators[dateValidator]
            ? {
                isValidDate: d =>
                  dateValidators[dateValidator](d) && isValidDate(d)
              }
            : {})}
          {...(dateValidatorDateView[dateValidator]
            ? { viewDate: dateValidatorDateView[dateValidator] }
            : {})}
          closeOnTab={true}
          closeOnSelect={true}
          onFocus={onFocus}
          {...restConfig}
        />
        <span className="error">{errorMsg}</span>
      </div>
    );
  }
}

export default DateTimeInput;
