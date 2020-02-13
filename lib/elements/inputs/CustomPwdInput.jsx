import React from 'react';
import FormInput from './FormInput';

class CustomPwdInput extends FormInput{
  state={
    pwdType: 'text',
    hide: false
  }
  componentDidMount(){
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
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

  onFocusCustomPwd =()=>{
    this.setState({ readOnly: false, focused: true });
  }

  handleInputChange = e => {
    let newValue = e.target.value
    this.props.onInputChange(newValue);
  }

  render(){
    let {config, value, error, errorMsg, onInputChange, onRef, ...rest} = this.props;
    return (
      <div className={`${config.containerClass || ''} ${config.loading ? 'input-loading' : ''}`}>
        <input type="password" tabIndex="-1" required name="fake_pwd" style={{position: 'absolute', top: '-20000px'}} key="fake-pwd"/>
        <input
          key="real-pwd"
          type={this.state.pwdType}
          {...this.state.hide ? {'data-type': 'custom-pwd'} : {}}
          value={config.value}
          {...config.readOnly ? {'readOnly': 'true'} : {}}
          onFocus={this.onFocusCustomPwd}
          autoComplete="off"
          error={config.error.toString()}
          {...rest}
          onChange={this.handleInputChange}
          required
          {...common}
        />
        <span className="error">{errorMsg}</span>
        <span className={`eye ${this.state.hide ? 'show' : 'hide'}`} onClick={this.showHidePwd} show={(!config.hideEye).toString()}/>
      </div>
    );
  }
}

export default CustomPwdInput;
