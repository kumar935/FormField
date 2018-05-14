import '../styles/common.css';
import React, { Component } from 'react';
import 'react-select/dist/react-select.css';
import Select from 'react-select';
import {REGEXP_PREFIX, ERROR_MSGS} from "./Constants";
import {
  InputWrapper,
  Input,
  Label,
  Line,
  DefaultSelectWrapper,
  LinedSelectWrapper,
  styleDefaults
} from "./StyledElements";
import {validationProfilesConfig} from "./ValidationProfiles";

const selectStyleWrapperMap = {
  "default" : DefaultSelectWrapper,
  "lined": LinedSelectWrapper
}


class FormField extends Component {
  static defaults = {
    styles: styleDefaults,
    validationProfiles : validationProfilesConfig
  }
  constructor(){
    super();
    this.state = {
      error: false,
      errorMsg: '',
      value: '',
      pwdType: 'text',
      hide: false,
      readOnly: true,
      webKitTextSecurityPresent: false,
    };
  }


  componentDidMount() {
    console.log("hii? ", FormField.defaults);
    if(this.props.config.initVal) this.setState({ value: this.props.config.initVal });
    if(this.props.onRef){
      this.props.onRef(this);
    } else {
      console.warn(`define onRef function for: ${this.props.config.label}`)
    }
    this.init();
  }
  init(){
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if(this.props.config.type === 'custom-pwd'){
      var x = document.getElementsByTagName("input")[0];
      var style = window.getComputedStyle(x);
      if (style.webkitTextSecurity) {
        this.setState({webKitTextSecurityPresent: true});
        window.setTimeout(() => this.setState({ hide: true }), 100);
      } else {
        this.setState({
          pwdType: 'password',
          hide: true,
          ...{...isIE ? {readOnly: false} : {}}
        });
      }
    }
  }
  showHidePwd = () => {
    this.setState(prevState=> {
      if(this.state.webKitTextSecurityPresent){
        return {
          hide: !prevState.hide,
        }
      } else {
        let hide = !prevState.hide;
        return {
          hide,
          pwdType: hide ? 'password' : 'text'
        }
      }
    })
  }
  componentWillUnmount() {
    this.setValue('');
    if(this.props.onRef) this.props.onRef(null);
  }
  handleSelectChange = newVal => {
    this.setState({
      value: newVal,
      error: false,
      errorMsg: ''
    }, () => {
      if(this.props.onChange){
        this.props.onChange(newVal);
      }
    });
  }
  handleRadioChange = changeEvent => {
    this.setState({
      value: changeEvent.target.value,
      error: false,
      errorMsg: ''
    })
  }
  handleInputChange = (e) => {
    let newValue = e.target.value;
    if(this.props.config.type === 'number'){
      if(isNaN(newValue)) return;
    }
    if(this.props.config.sizeRange){
      let max = this.props.config.sizeRange[1];
      if(newValue.length > max){
        return;
      }
    }
    if(this.props.config.inputValidations){
      let invalid = this.isInputInvalid(newValue);
      if(invalid === true) return;
    }
    this.setState({
      error: false,
      errorMsg: '',
      value: newValue
    }, () => {
      if(this.props.config.liveValidations) this.liveValidate();
      if(this.props.onChange){
        this.props.onChange(newValue);
      }
    });
  }
  setError(config){
    if(this.props.config.type === 'custom-pwd') this.setValue(this.value);
    this.setState({
      error: true,
      errorMsg: config.errorMsg || ERROR_MSGS.DEFAULT
    })
  }
  clearError(){
    this.setState({
      error: false,
      errorMsg: ''
    })
  }
  focus(){
    this.input.focus();
  }
  isInputInvalid(val){
    let inputValidations = this.props.config.inputValidations || [];
    let invalid = false;
    for(let i=0; i<inputValidations.length; i++){
      let valProfile = inputValidations[i];
      if(FormField.defaults.validationProfiles[valProfile] === undefined){
        if(valProfile.indexOf(REGEXP_PREFIX) === 0){
          let regExp = new RegExp(valProfile.replace(REGEXP_PREFIX, ""));
          invalid = !regExp.test(this.state.value);
          if(invalid) break;
        }
      } else {
        let result = FormField.defaults.validationProfiles[inputValidations[i]](val, this.props);
        if(!result.valid){
          invalid = true;
          break;
        }
        invalid = false;
      }
    }
    return invalid;
  }
  liveValidate(){
    let validationProfiles = this.props.config.liveValidations || ['default'];
    return this.validate(validationProfiles);
  }
  isValid(){
    let validationProfiles = this.props.config.validationProfiles || ['default'];
    return this.validate(validationProfiles);
  }
  validate(validationProfiles){
    let valid = false;
    if(validationProfiles.length === 0) valid = true;
    for(let i=0; i<validationProfiles.length; i++){
      let valProfile = validationProfiles[i];
      if(FormField.defaults.validationProfiles[valProfile] === undefined){
        if(valProfile.indexOf(REGEXP_PREFIX) === 0){
          let regExp = new RegExp(valProfile.replace(REGEXP_PREFIX, ""));
          valid = regExp.test(this.state.value);
          if(!valid){
            this.setState({
              error: true,
              errorMsg: ERROR_MSGS.INVALID_INPUT
            });
            break;
          }
        }
      } else {
        let result = FormField.defaults.validationProfiles[valProfile](this.state.value, this.props);
        if(!result.valid){
          this.setState({
            error: true,
            errorMsg: result.errorMsg
          });
          valid = false;
          break;
        }
        valid = true;
      }
    }
    return valid;
  }
  getValue(){
    if(this.props.config.type === 'custom-pwd') return this.getValueSetBlank();
    return this.state.value;
  }
  getOnlyValue(){
    return this.state.value;
  }
  setValue(value){
    return new Promise(resolve => {
      this.setState({
        value,
        ...!value ? {} : {error: false, errorMsg: ""}
      }, ()=>{
        resolve({"done": "ok"});
      });
    });
  }
  getValueSetBlank(){
    this.value = this.state.value;
    this.setValue('');
    return this.value;
  }
  onFocusCustomPwd =()=>{
    this.setState({ readOnly: false, focused: true });
  }
  render(){
    const {config, onRef, ...rest} = this.props;
    const common = {
      color: FormField.defaults.color,
      ref:input => { this.input = input; }
    }
    if(config.type === 'radio'){
      return (
        <div className="radio-group">
          {config.label && !config.hideLabel ? <Label>{config.label}</Label> : ''}
          <div className="radio-group-wraper">
            {config.options.map(option => (
              <React.Fragment>
                <Label className="radio">
                  <Input
                    type="radio"
                    color={FormField.defaults.color}
                    value={option.value}
                    checked={this.state.value === option.value}
                    onChange={this.handleRadioChange}/>
                  <span />
                </Label>
                <Label className="radioLabel" htmlFor={option.label}>{option.label}</Label>
              </React.Fragment>
            ))}
          </div>
          <span className="error">{this.state.errorMsg}</span>
        </div>
      );
    }
    if(config.type === 'select'){
      const SelectWrapper = selectStyleWrapperMap[FormField.defaults.styles.selectStyle] || DefaultSelectWrapper;
      let selectProps = {
        name:`select-${config.label}`,
        value:this.state.value,
        options:config.options || [],
        onChange:this.handleSelectChange,
        clearable:false,
        noResultsText:config.loading ? 'Loading...' : 'No Results',
        ...config.SelectArgs ? config.SelectArgs : {}
      };
      return (
        <SelectWrapper
          className={`select-box label ${config.containerClass || ''}`}
          error={this.state.error.toString()}
          color={FormField.defaults.color}>
          <Label>{config.label}</Label>
          {this.state.disabled ? (
            <Select
              {...selectProps}
              disabled={true}
            />
          ) : (
            <Select
              {...selectProps}
              disabled={false}
            />
          )}
          <span className="error-msg select-error">{this.state.errorMsg}</span>
          {FormField.defaults.styles.selectStyle === "lined" ? (
            <Line />
          ): ''}
        </SelectWrapper>
      );
    }
    return (
      <InputWrapper className={config.containerClass || ''}>
        {(() => {
          switch(config.type){
            case 'text':
            case 'password':
              return (
                <Input
                  type={config.type}
                  value={this.state.value}
                  error={this.state.error.toString()}
                  autoComplete="off"
                  {...rest}
                  onChange={this.handleInputChange}
                  required
                  {...common}
                />
              );
              break;
            case 'custom-pwd':
              return [
                <Input type="password" tabIndex="-1" required name="fake_pwd" style={{position: 'absolute', top: '-20000px'}} key="fake-pwd"/>,
                <Input
                  key="real-pwd"
                  type={this.state.pwdType}
                  {...this.state.hide ? {'data-type': 'custom-pwd'} : {}}
                  value={this.state.value}
                  {...this.state.readOnly ? {'readOnly': 'true'} : {}}
                  onFocus={this.onFocusCustomPwd}
                  autoComplete="off"
                  error={this.state.error.toString()}
                  {...rest}
                  onChange={this.handleInputChange}
                  required
                  {...common}
                />
              ];
              break;
            case 'number':
              return (
                <Input
                  type='text'
                  value={this.state.value}
                  error={this.state.error.toString()}
                  {...rest}
                  onChange={this.handleInputChange}
                  required
                  {...common}
                />
              );
              break;
            default:
              return (
                <Input
                  type="text"
                  value={this.state.value}
                  autoComplete="off"
                  error={this.state.error.toString()}
                  {...rest}
                  onChange={this.handleInputChange}
                  required
                  {...common}
                />
              );
          }
        })()}
        {config.type === 'custom-pwd' ? (
          <span className={`eye ${this.state.hide ? 'show' : 'hide'}`} onClick={this.showHidePwd}/>
        ) : ''}
        <Label htmlFor={this.props.id}>{this.props.config.label}</Label>
        <span className="error-msg">{this.state.errorMsg}</span>
        {config.posRightBtn && config.posRightBtn.domClass ? (
          <Label
            className={`position-right ${config.posRightBtn.domClass}`}
            onClick={config.posRightBtn.onClick}
          />
        ) : ''}
        <Line className="line" color={FormField.defaults.color}/>
      </InputWrapper>
    )
  }
}

export default FormField;

