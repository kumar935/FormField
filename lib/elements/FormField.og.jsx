import React, { Component } from 'react';
import {I18n} from '../../utils/LangUtil';
import {AsyncVKeyboard} from "../AsyncLib";
import Select from 'react-select';
import {REGEXP_PREFIX} from "../Constants";

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
  ONLY_ALPHABETS: "Please enter valid input (alphabets with special characters allowed [-], [.], [:], ['])",
  INVALID_INPUT: 'Please enter valid input',
  ONLY_NUMBERS: 'Only numbers are allowed',
  ONLY_ARABIC: 'Only Arabic characters allowed'
};

const validationProfilesConfig = {
  default(val, props){
    if(val === ''){
      let emptyErr = I18n(`g.msg.fieldempty:${props.config.label}`);
      if(props.config.emptyErrKey){
        emptyErr = I18n(props.config.emptyErrKey)
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
    let notAllowed = /[ `~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val);
    return {
      valid: !notAllowed,
      errorMsg: ERROR_MSGS.SP_CH_NOT_ALLOWED
    }
  },
  onlyAlphabets(val){
    let valid = /[a-z ,.'-]+/.test(val);
    return {
      valid: valid,
      errorMsg: ERROR_MSGS.ONLY_ALPHABETS
    }
  },
  onlyNumbers(val){
    return {
      valid: !isNaN(val),
      errorMsg: ERROR_MSGS.ONLY_NUMBERS
    }
  },
  onlyArabicChars(val){
    let valid = /[\u0621-\u064A\u0660-\u0669 ]+/.test(val);
    return {
      valid,
      errorMsg: ERROR_MSGS.ONLY_ARABIC
    };
  },
  "regex_[a-z ,.'-]+"(val){ return this.onlyAlphabets(val)},
  "regex_[\u0621-\u064A\u0660-\u0669 ]+"(val){ return this.onlyArabicChars(val)}
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
      showKeyboard: false
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
    let newValue = changeEvent.target.value;
    this.setState({
      value: changeEvent.target.value,
      error: false,
      errorMsg: ''
    }, () => {
      if(this.props.onChange){
        this.props.onChange(newValue);
      }
    })
  }
  handleInputChange = (e, virtual) => {
    if(this.state.showKeyboard && !virtual) return; //if virtual keyboard open, mechanical keyboard ignore input.
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
  setErrorOnly(config){
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
    if(process.env.DEV) console.debug(this.props.config.label, " ", valid);
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
  // onFocusCustomPwd =()=>{
  //   if(!this.state.focused) {
  //     this.setState({ hide: true, focused: true});
  //   }
  // }
  onClickShowKeyboard = () => {
    this.setState(prevState=> {
      return {
        showKeyboard: !prevState.showKeyboard,
        ...{...prevState.showKeyboard === true ? {} :{value: ''}}
      };
    });
  }
  clear = () => {
    if(this.props.config.type !== "select") return;
    this.setState({
      value: "",
      label: "Select..."
    })
  }
  onChangeVirtualKeyboard = e => {
    if(!this.keyboard) return;
    this.input.focus();
    this.handleInputChange({target:{value: e}}, true);
  }
  onVirtualKeyboardInputSubmitted = () => {
    this.setState({ showKeyboard: false });
  }
  onVirtualKeyboardInputCancelled = () => {
    this.setState({ showKeyboard: false, value: '' });
  }
  render(){
    const {config, onRef, ...rest} = this.props;
    const common = {
      ref:input => { this.input = input; }
    }
    if(config.type === 'radio'){
      return (
        <div className="radio-group">
          {config.label && !config.hideLabel ? <label>{config.label}</label> : ''}
          <div className="radio-group-wraper">
            {config.options.map((option,i) => (
              <React.Fragment key={`radio-option-${i}`}>
                <label className="radio">
                  <input
                    type="radio"
                    id={option.label}
                    value={option.value}
                    checked={this.state.value == option.value}
                    onChange={this.handleRadioChange}/>
                  <span />
                </label>
                <label className="radioLabel" htmlFor={option.label}>{option.label}</label>
              </React.Fragment>
            ))}
          </div>
          <span className="error">{this.state.errorMsg}</span>
        </div>
      );
    }
    if(config.type === 'select'){
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
          <div
            className={`select-box label ${config.containerClass || ''} ${config.loading ? 'input-loading' : ''}`}
            error={this.state.error.toString()}>
          <label>{config.label}</label>
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
          <span className="line" />
        </div>
      );
    }
    return (
      <div className={`floating-label-input ${config.containerClass || ''}`}>
        {(() => {
          switch(config.type){
            case 'text':
            case 'password':
              return (
                <input
                  type={config.type}
                  value={this.state.value}
                  error={this.state.error.toString()}
                  autoComplete="off"
                  {...rest}
                  onChange={this.handleInputChange}
                  {...this.state.disabled ? {disabled: true, active: "true"} : {}}
                  required
                  {...common}
                />
              );
              break;
            case 'custom-pwd':
              return [
                <input type="password" tabIndex="-1" required name="fake_pwd" style={{position: 'absolute', top: '-20000px'}} key="fake-pwd"/>,
                <input
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
                <input
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
                <input
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
        {config.virtualKeyboard ? (
          <div className="keyboard-container" key="keyboard-container">
            {this.state.showKeyboard ? (
              <AsyncVKeyboard
                value={this.state.value}
                name='keyboard'
                options={{
                  type:"input",
                  layout: "custom",
                  customLayout: {
                    'normal': [
                      '~ ! @ # $ % ^ & * ( )',
                      '1 2 3 4 5 6 7 8 9 0 {bksp}',
                      'q w e r t y u i o p',
                      'a s d f g h j k l {enter}',
                      '{shift} z x c v b n m {shift}',
                      '{accept} {space} {cancel} {extender}'],
                    'shift': [
                      '~ ! @ # $ % ^ & * ( )',
                      '1 2 3 4 5 6 7 8 9 0 {bksp}',
                      'Q W E R T Y U I O P',
                      'A S D F G H J K L {enter}',
                      '{shift} Z X C V B N M {shift}',
                      '{accept} {space} {cancel} {extender}']
                  },
                  alwaysOpen: true,
                  usePreview: false,
                  useWheel: false,
                  stickyShift: true,
                  appendLocally: true,
                  color: "light",
                  updateOnChange: true,
                  initialFocus: true,
                  ...{...config.sizeRange ? {maxLength: config.sizeRange[1]} : {}},
                  display: {
                    "accept" : "Submit"
                  }
                }}
                onChange={this.onChangeVirtualKeyboard}
                onAccepted={this.onVirtualKeyboardInputSubmitted}
                onRef={ref => {
                  this.keyboard = ref;
                  if(this.keyboard && this.keyboard.interface){
                    this.keyboard.interface.keyaction.cancel = this.onVirtualKeyboardInputCancelled;
                    this.keyboard.interface.keyaction.enter = this.onVirtualKeyboardInputSubmitted;
                  }
                }}
              />
            ) : ''}
          </div>
        ) : ''}
        {config.label && !config.hideLabel ? <label htmlFor={this.props.id}>{this.props.config.label}</label> : ''}
        <span className="error-msg">{this.state.errorMsg}</span>
        {config.posRightBtn && config.posRightBtn.domClass ? (
          <label
            className={`position-right ${config.posRightBtn.domClass}`}
            onClick={config.posRightBtn.onClick}
          />
        ) : ''}
        <span className="line" />
        {config.virtualKeyboard && config.type === 'custom-pwd' ? (
          <div
            className="checkboxWrapper keyboard-checkbox">
            <input
              name={`show-keyboard ${this.props.id}`}
              id={`show-keyboard ${this.props.id}`}
              type="checkbox"
              checked={this.state.showKeyboard}
              onChange={this.onClickShowKeyboard}
              hidden
            />
            <label htmlFor={`show-keyboard ${this.props.id}`} className="checkbox">{I18n("g.msg.vkboard")}</label>
          </div>
        ) : ''}
      </div>
    )
  }
}

export default FormField;
