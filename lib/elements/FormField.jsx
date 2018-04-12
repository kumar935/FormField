import '../styles/common.css';
import 'react-select/dist/react-select.css';
import React, { Component } from 'react';
import Select from 'react-select';
import {REGEXP_PREFIX} from "./Constants";
import styled from 'styled-components';
const color = "#4a70e4";

const ERROR_MSGS = {
  DEFAULT: 'There was an error',
  FIELD_EMPTY: 'This field cannot be empty',
  PWD_INVALID: 'Password should contain at least one uppercase alphabet, digit and a special character (!, @, $, %)',
  FAILED: 'failed',
  INVALID_EMAIL: 'Please enter a valid email ID',
  INVALID_CIVILID: 'Invalid Civil Id format',
  SP_CH_NOT_ALLOWED: 'Special character not allowed',
  NO_SPACES: 'No spaces allowed',
  THESE_SP_CH_NOT_ALLOWED: 'This special character is not allowed. Characters allowed are  ! @ $ and %',
  NO_NUMBERS: 'Numbers are not allowed',
  ONLY_ALPHABETS: 'Only Alphabets are allowed',
  INVALID_INPUT: 'Please enter valid input'
};

const InputWrapper = styled.div`
  margin: 0;
  padding: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  cursor: text;
  height: 60px;
  margin-bottom: 16px;
  text-align: left;
  &::-webkit-contacts-auto-fill-button, &::-webkit-credentials-auto-fill-button {
    visibility: hidden;
    pointer-events: none;
    position: absolute;
    right: 0;
  }
`;
const Input = styled.input`
  width: 100%;
  height: 100%;
  position: relative;
  background: transparent;
  outline: none;
  border: none;
  vertical-align: middle;
  font-size: 20px;
  font-weight: bold;
  padding-top: 10px;
  text-align: inherit;
  z-index:1;
    input ~ .error-msg {
    display: none;
  }
  & ~ .error-msg, & ~ .notif-msg, & ~ .loading {
    font-size: 12px;
    margin-top: 4px;
    color: #f35353;
  }
  & ~ .notif-msg {
    color: ${color};
  }
  & ~ .loading {
    color: #545454;
  }
  &[error="true"] ~ .error-msg {
    display: block;
  }
  &:focus ~ label, &[active="true"] ~ label, &:valid ~ label {
    top: 0;
    font-size: 15px;
    color: ${color};
  }
  &:focus ~ label.button, &[active="true"] ~ label.button, &:valid ~ label.button {
    color: #fff;
  }
  &:disabled ~ label {
    color: #d6d6d6;
  }
  &:disabled ~ .line {
    background: #d6d6d6;
  }
  &:focus ~ .line, &[active="true"] ~ .line, &:valid ~ .line {
    &:after {
      width: 100%;
    }
  }
  &::placeholder {
    color: #aaaaaa;
    font-size: 14px;
    font-weight: normal;
  }
  &[data-type='custom-pwd']{
    text-security:disc;
    -webkit-text-security:disc;
    -mox-text-security:disc;
  }
`;
const Label = styled.label`
  position: absolute;
  top: calc(50% - 5px);
  font-size: 22px;
  left: 0;
  color: #000;
  transition: all 0.3s;
  cursor: text;
  &.position-right{
    right: 0!important;
    left: auto;
    top: auto !important;
    bottom:5px;
    z-index:1;
    font-weight: normal;
  }
  &.button{
    text-transform: none;
    color: #fff;
  }
`;
const Line = styled.span`
  position: absolute;
  height: 1px;
  width: 100%;
  bottom: 0;
  background: #000;
  left: 0;
  &:after {
    content: "";
    display: block;
    width: 0;
    background: ${color};
    height: 1px;
    transition: all 0.5s;
  }
`;


const SelectWrapper = styled.div`
  position: relative;
  height: 36px;
  line-height: 36px;
  &.label {
    padding-top: 15px;

    .Select{
      top:20px;
    }
  }
  .Select{
    font-size: 14px;
    position: absolute;
    height: 100%;
    width: 100%;
    line-height: inherit;
    top:0;
    .Select-control, Select-multi-value-wrapper,.Select-input, .Select-placeholder{
      height: inherit;
      line-height: inherit;
    }
  }
  .error-msg{
    display: none;
  }
  label {
    position: absolute;
    top: 0;
    font-size: 14px;
    color: ${color};
    left: 0;
    line-height: 15px;
    z-index: 1;
    white-space: nowrap;
  }
  .line {
    position: absolute;
    height: 1px;
    width: 100%;
    bottom: 0;
    background: #000;
    left: 0;
    &:after {
      content: "";
      display: block;
      width: 0;
      background: #33bb55;
      height: 1px;
      transition: all 0.5s;
    }
  }
  select:focus ~ .line, select:focus ~ .line, select:valid ~ .line, .has-value ~  .line{
    &:after {
      width: 100%;
    }
  }
  .select-error{
    font-size: 12px;
    color: #f35353;
    top: 27px;
    position: relative;
  }
`

const validationProfilesConfig = {
  default(val, props){
    if(val === ''){
      let emptyErr = ERROR_MSGS.FIELD_EMPTY;
      if(props.config.emptyErrKey){
        emptyErr = props.config.emptyErrKey;
      }
      return {
        valid: false,
        errorMsg: emptyErr
      }
    } else if(props.config.sizeRange) {
      let min = props.config.sizeRange[0] || 0;
      let max = props.config.sizeRange[1] || Infinity;
      let exact = min === max;
      if(val.length <= max && val.length >= min){
        return {
          valid: true
        }
      } else {
        return {
          valid: false,
          errorMsg: `Length of ${props.config.label} should be ${exact ? min : `between ${min} and ${max}`} ${props.config.type === 'number' ? 'digits' : 'characters'}`
        }
      }
    } else {
      return {
        valid: true
      }
    }
  },
  noSpaces(val){
    let containsSpace = /\s/g.test(val);
    return {
      valid: !containsSpace,
      errorMsg: ERROR_MSGS.NO_SPACES
    }
  },
  noNumbers(val){
    let hasNumber = /\d/.test(val);
    return {
      valid: !hasNumber,
      errorMsg: ERROR_MSGS.NO_NUMBERS
    }
  },
  theseSpChNotAllowed(val){
    let containsUnwantedSpChars = /[#^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(val);
    return {
      valid: !containsUnwantedSpChars,
      errorMsg: ERROR_MSGS.THESE_SP_CH_NOT_ALLOWED
    }
  },
  password(val){
    let containsDigits = /[0-9]/.test(val);
    let containsUpper = /[A-Z]/.test(val);
    let containsLower = /[a-z]/.test(val);
    let containsSpecialChars = /[!@%$]/.test(val);
    let containsUnwantedSpChars = /[#^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(val);

    if (containsDigits && containsUpper && containsLower && containsSpecialChars && !containsUnwantedSpChars){
      return {
        valid: true
      }
    } else {
      return {
        valid: false,
        errorMsg: ERROR_MSGS.PWD_INVALID
      }
    }
  },
  email(val){
    let valid = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( val );
    return {
      valid,
      errorMsg: ERROR_MSGS.INVALID_EMAIL
    }
  },
  civilid(val){
    let valid = !isNaN(val) && val.toString().indexOf(".") === -1;
    return {
      valid,
      errorMsg: ERROR_MSGS.INVALID_CIVILID
    }
  },
  spCharacterNotAllowed(val){
    let notAllowed = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val);
    return {
      valid: !notAllowed,
      errorMsg: ERROR_MSGS.SP_CH_NOT_ALLOWED
    }
  },
  onlyAlphabets(val){
    let valid = /^[a-zA-Z]*$/.test(val);
    return {
      valid: valid,
      errorMsg: ERROR_MSGS.ONLY_ALPHABETS
    }
  },
  "regex_^[a-zA-Z]*$"(val){ return this.onlyAlphabets(val)}
};

class FormField extends Component {
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
      if(validationProfilesConfig[valProfile] === undefined){
        if(valProfile.indexOf(REGEXP_PREFIX) === 0){
          let regExp = new RegExp(valProfile.replace(REGEXP_PREFIX, ""));
          invalid = !regExp.test(this.state.value);
          if(invalid) break;
        }
      } else {
        let result = validationProfilesConfig[inputValidations[i]](val, this.props);
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
      if(validationProfilesConfig[valProfile] === undefined){
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
        let result = validationProfilesConfig[valProfile](this.state.value, this.props);
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
      this.setState({value}, ()=>{
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
      return (
        <SelectWrapper className={`select-box label ${config.containerClass || ''}`} error={this.state.error.toString()}>
          <Label>{config.label}</Label>
          <Select
            name={`select-${config.label}`}
            value={this.state.value}
            options={config.options || []}
            onChange={this.handleSelectChange}
            clearable={false}
            {...config.SelectArgs ? config.SelectArgs : {}}
          />
          <span className="error-msg select-error">{this.state.errorMsg}</span>
          {/*<Line />*/}
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
        <Line className="line"/>
      </InputWrapper>
    )
  }
}

export default FormField;
