import React, { Component } from "react";
import { validationProfilesConfig, ERROR_MSGS } from "./validationProfiles";
import validationService from "./validationService";
import TextInput from "./inputs/TextInput";
import NumberInput from "./inputs/NumberInput";
import CustomPwdInput from "./inputs/CustomPwdInput";
import TextAreaInput from "./inputs/TextAreaInput";
import SelectInput from "./inputs/SelectInput";
import RadioInput from "./inputs/RadioInput";
import NestedSelectInput from "./inputs/NestedSelectInput";
import NestedMultiSelectInput from "./inputs/NestedMultiSelectInput";
import CheckBoxGroup from "./inputs/CheckBoxGroup";
// import DateTimeInput from "./inputs/DateTimeInput";
import CurrencyInput from "./inputs/CurrencyInput";
import OtpInput from "./inputs/OtpInput";
class FormFieldMain extends Component {
  constructor(props) {
    super(props);
    this.formInput = React.createRef();
    this.state = {
      error: false,
      errorMsg: "",
      value: props.controlled ? props.value : "",
      pwdType: "text",
      hide: false,
      readOnly: true
    };
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.controlled && nextProps.value && prevState.value !== nextProps.value) {
  //     return {
  //       value: nextProps.value
  //     };
  //   } else return null;
  // }

  validationProfiles = {
    ...validationProfilesConfig,
    ...(this.customValidationProfiles || {})
  };

  fields = {
    text: TextInput,
    number: NumberInput,
    password: TextInput,
    "custom-pwd": CustomPwdInput,
    textarea: TextAreaInput,
    radio: RadioInput,
    select: SelectInput,
    checkbox: CheckBoxGroup,
    // date: DateTimeInput,
    nselect: NestedSelectInput,
    "multi-nselect": NestedMultiSelectInput,
    currency: CurrencyInput,
    otp: OtpInput
  };

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }

  getValidators(validationProfileKeys) {
    let validators = (validationProfileKeys || []).map(v => {
      if (this.validationProfiles[v] === undefined) {
        if (typeof v === "function") return v; // somehow a funcition is passing the validationService.validRegex(), so bumping this up
        if (v instanceof RegExp || validationService.validRegex(v)) {
          let regExp = v;
          if (validationService.validRegex(v))
            regExp = validationService.regexpStringToObj(v);
          return value => ({
            valid: regExp.test(value),
            errorMsg: "Invalid Input"
          });
        }
        console.error(`no validation profile found for ${v}`);
      }
      return this.validationProfiles[v];
    });
    return validators;
  }

  isInputValid(value) {
    let { config } = this.props;
    let inputValidations = this.getValidators(
      this.props.config.inputValidations
    );
    let validationResults = validationService.validate(inputValidations, {
      value,
      config
    });
    return validationResults.every(v => v.valid === true);
  }

  liveValidate(value) {
    let { config } = this.props;
    let liveValidators = this.getValidators(
      this.props.config.liveValidations || ["default"]
    );
    let validationResults = validationService.validate(liveValidators, {
      value,
      config
    });
    let errors = validationResults.filter(v => v.valid === false);
    if (errors.length) this.setError({ errorMsg: errors[0].errorMsg });
  }

  isValid() {
    let { config } = this.props;
    if (config.required === false) {
      this.clearError();
      return true;
    };
    let { validationProfiles } = this.props.config;
    validationProfiles =
      validationProfiles &&
      typeof validationProfiles === "object" &&
      validationProfiles.length
        ? validationProfiles
        : null;
    let validators = [
      ...(this.formInput.inputValidator ? [this.formInput.inputValidator] : []),
      ...this.getValidators(validationProfiles || ["default"])
    ];
    let validationResults = validationService.validate(validators, {
      value: this.getValue(),
      config
    });
    let errors = validationResults.filter(v => v.valid === false);
    if (errors.length) this.setError({ errorMsg: errors[0].errorMsg });
    return errors.length === 0;
  }

  transform(value) {
    let { transform } = this.props.config;
    let transformFn = validationProfilesConfig[transform];
    let result;
    if (transformFn) result = transformFn(value);
    if (result && result.corrected) {
      return result.corrected;
    }
  }

  handleInputChange = (newValue, notFromUser = false) => {
    if (this.props.config.inputValidations && !this.isInputValid(newValue))
      return;
    if (this.props.config.transform)
      newValue = this.transform(newValue) || newValue;
    this.clearError();
    // if (this.props.controlled && this.props.onControlledChange && !notFromUser)
    //   this.props.onControlledChange(newValue);
    if (this.props.controlled) return this.props.onChange(newValue); //return from here

    this.setState(
      {
        value: newValue
      },
      () => {
        if (this.props.config.liveValidations) this.liveValidate(newValue);
        if (this.props.onChange && !notFromUser) {
          this.props.onChange(newValue);
        }
      }
    );
  };

  getValue = () =>
    this.props.controlled ? this.props.value : this.state.value;
  enable = () => {
    this.setState({ disabled: false });
    return this;
  };
  disable = () => {
    this.setState({ disabled: true });
    return this;
  };

  setValue(value) {
    if (this.formInput.valueModifier)
      value = this.formInput.valueModifier(value) || value;
    if (value) this.clearError();
    return new Promise(resolve => {
      this.setState(
        {
          value
        },
        () => {
          resolve({ done: "ok" });
        }
      );
    });
  }

  setError({ errorMsg } = {}) {
    this.errorMsg = errorMsg || ERROR_MSGS.DEFAULT;
    this.setState({
      error: true,
      errorMsg: this.errorMsg
    });
  }

  clearError() {
    this.errorMsg = "";
    this.setState({
      error: false,
      errorMsg: this.errorMsg
    });
  }

  val = value => {
    if (value === undefined) return this.getValue();
    return this.setValue(value);
  };

  focus = () => {
    try {
      this.formInput.focus();
    } catch (error) {
      console.log("focusing failed: ", error);
    }
  };

  componentWillUnmount() {
    this.setValue("");
    if (this.props.onRef) this.props.onRef(null);
  }

  render() {
    const { config, onRef, disabled, value, ...rest } = this.props; //writing onRef, disabled, value, so that they don't get included in ...rest
    let { error, errorMsg } = this.state;
    const common = {
      value: this.props.controlled ? this.props.value : this.state.value,
      error,
      errorMsg,
      disabled: this.props.disabled
    };
    let Field = this.fields[config.type];
    if (!Field) {
      Field = this.fields["text"];
      console.error(
        `FormField type:${config.type} not found, falling back to text`
      );
    }
    return (
      <Field
        onRef={ref => (this.formInput = ref)}
        onInputChange={this.handleInputChange}
        config={config}
        {...common}
        {...rest}
      />
    );
  }


}

export default FormFieldMain;
