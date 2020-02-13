import FormInput from "./FormInput";
import React from "react";
import Select, { components } from "react-select";
const select_height = 34;
const Option = props => {
  return (
    <div>
      <components.Option
        {...props}
        selectOption={() => {
          props.selectOption("-");
        }}
      />
    </div>
  );
};

class SelectInput extends FormInput {
  constructor(props) {
    super(props);
    this.state = {
      options: props.config.options || [],
      loading: props.config.loading
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let { options, loading } = nextProps.config;
    if (options || loading !== undefined) {
      return {
        ...(options ? { options } : {}),
        ...(loading !== undefined ? { loading } : {})
      };
    } else return null;
  }

  componentDidMount() {
    super.componentDidMount(); //important coz the ref calls are in FormInput
    this.initSelection();
    if(this.props.autoFocus){
      console.log('logging this.props.autoFocus: ', this.props.autoFocus);
      this.focus();
    }
  }

  initSelection = () => {
    let { options } = this.state;
    let { value = {} } = this.props;
    if (
      value !== "" &&
      typeof value !== "object" &&
      options.find(opt => value == opt.value)
    ) {
      let newVal = this.valueModifier(value);
      this.props.onInputChange(newVal, false);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    let { options } = this.state;
    let { value = {}, controlled } = this.props;
    if (
      this.props.config.populateSingleOption &&
      options.length === 1 &&
      value !== options[0].value
    ) {
      value = options[0].value;
    }
    if (
      value !== "" &&
      typeof value !== "object" &&
      options.find(opt => value == opt.value)
    ) {
      let newVal = this.valueModifier(value);
      if (prevProps.value != newVal) this.props.onInputChange(newVal, false);
      //selecting the value that was set before options were populated
    } else if (
      value &&
      typeof value === "object" &&
      value.value &&
      !options.find(opt => (value || {}).value == opt.value)
    ) {
      this.props.onInputChange("", false); //clearing select if current value not in new options
    }
  }

  focus = () => {
    this.input.select.focus();
  };

  handleSelectChange = newVal => {
    this.props.onInputChange(newVal);
  };

  inputValidator = value => {
    let isMulti =
      this.props.config.SelectArgs && this.props.config.SelectArgs.isMulti;
    let valid = isMulti
      ? !!value.length
      : value && typeof value === "object" && value.value;
    return {
      valid,
      errorMsg: `Please enter ${this.props.config.label}`
    };
  };

  valueModifier = value => {
    let { options = [] } = this.state;
    let selectedOption;
    options.map(option => {
      if (option.value == value) {
        selectedOption = option;
      }
    });
    return selectedOption;
  };

  render() {
    let {
      config,
      value,
      error,
      loading,
      disabled,
      errorMsg,
      style = {},
      onFocus,
      onBlur,
      ...rest
    } = this.props;
    const commonDisabledStyles = {
      borderColor: "#d2d2d2",
      color: "#555555"
    };
    let {
      control: controlOverrides,
      input: inputOverrides,
      singleValue: singleValueOverrides,
      option: optionOverrides,
      placeholder: placeholderOverrides,
      dropdownIndicator: dropdownIndicatorOverrides,
      indicatorSeparator: indicatorSeparatorOverrides,
      valueContainer: valueContainerOverrides,
      container: containerOverrides,
      clearIndicator: clearIndicatorOverrides,
      group: groupOverrides,
      groupHeading: groupHeadingOverrides,
      indicatorsContainer: indicatorsContainerOverrides,
      loadingIndicator: loadingIndicatorOverrides,
      loadingMessage: loadingMessageOverrides,
      menu: menuOverrides,
      menuList: menuListOverrides,
      menuPortal: menuPortalOverrides,
      multiValue: multiValueOverrides,
      multiValueLabel: multiValueLabelOverrides,
      multiValueRemove: multiValueRemoveOverrides,
      noOptionsMessage: noOptionsMessageOverrides
    } = style;
    const styles = {
      control: (styles, { isDisabled }) => ({
        ...styles,
        ...(isDisabled ? commonDisabledStyles : {}),
        minHeight: select_height,
        height: select_height,
        ...controlOverrides
      }),
      input: (styles, { isDisabled }) => ({
        ...styles,
        ...(isDisabled ? commonDisabledStyles : {}),
        ...inputOverrides
      }),
      singleValue: (styles, { isDisabled }) => ({
        ...styles,
        ...(isDisabled ? commonDisabledStyles : {}),
        ...singleValueOverrides
      }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
          ...styles,
          ...(isDisabled ? commonDisabledStyles : {}),
          color: "#333",
          textAlign: "left",
          fontSize: "13px",
          ...optionOverrides
        };
      },
      placeholder: (styles, { isDisabled }) => ({
        ...styles,
        ...(isDisabled ? commonDisabledStyles : {}),
        ...placeholderOverrides
      }),
      dropdownIndicator: (styles, { isDisabled }) => ({
        ...styles,
        ...dropdownIndicatorOverrides,
        ...(config.hideDropDownIndicator ? { display: "none" } : {}),
        ...(isDisabled ? commonDisabledStyles : {})
      }),


      container: (styles) => ({...styles, ...containerOverrides}),

      indicatorSeparator: styles => ({
        ...styles,
        ...indicatorSeparatorOverrides,
        ...(config.hideDropDownIndicator ? { display: "none" } : {})
      }),

      clearIndicator: (styles) => ({...styles, ...clearIndicatorOverrides}),
      group: (styles) => ({...styles, ...groupOverrides}),
      groupHeading: (styles) => ({...styles, ...groupHeadingOverrides}),
      indicatorsContainer: (styles) => ({...styles, ...indicatorsContainerOverrides}),
      loadingIndicator: (styles) => ({...styles, ...loadingIndicatorOverrides}),
      loadingMessage: (styles) => ({...styles, ...loadingMessageOverrides}),
      menu: (styles) => ({...styles, ...menuOverrides}),
      menuList: (styles) => ({...styles, ...menuListOverrides}),
      menuPortal: (styles) => ({...styles, ...menuPortalOverrides}),
      multiValue: (styles) => ({...styles, ...multiValueOverrides}),
      multiValueLabel: (styles) => ({...styles, ...multiValueLabelOverrides}),
      multiValueRemove: (styles) => ({...styles, ...multiValueRemoveOverrides}),
      noOptionsMessage: (styles) => ({...styles, ...noOptionsMessageOverrides}),

      valueContainer: styles => ({ ...styles, ...valueContainerOverrides })
    };
    const theme = theme => ({
      ...theme,
      borderRadius: 0,
      colors: {
        ...theme.colors,
        primary: "#4a8dbe"
      }
    });
    let selectProps = {
      name: `select-${config.label}`,
      value: value,
      styles,
      theme,
      ref: ref => (this.input = ref),
      options: this.state.options,
      isDisabled: disabled,
      defaultValue: config.defaultValue,
      isLoading: loading,
      onChange: this.handleSelectChange,
      onFocus,
      onBlur,
      clearable: false,
      components: { Option },
      placeholder: this.state.loading ? "Loading..." : "Select...",
      noResultsText: this.state.loading ? "Loading..." : "No Results",
      ...(config.SelectArgs || {})
    };
    return (
      <div
        className={`form-field-wrapper select-box ${config.containerClass ||
          ""} ${config.loading ? "input-loading" : ""}`}
        error={error.toString()}
        style={{ lineHeight: "normal" }}
      >
        <label
          style={{
            ...(config.hideLabel ? { display: "none" } : {}),
            ...(!config.label ? { display: "none" } : {})
          }}
        >
          {config.label || ""}
        </label>
        <Select {...selectProps} />
        <span className="error">{errorMsg}</span>
      </div>
    );
  }
}

export default SelectInput;
