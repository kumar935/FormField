import React from 'react';
import TextInput from "./TextInput";


class TextAreaInput extends TextInput{
  constructor(props){
    super(props);
  }
  render(){
    let {config, value, error, errorMsg, onRef, onInputChange, ...rest} = this.props;
    return (
      <div className={`${config.containerClass || ''} ${config.loading ? 'input-loading' : ''}`}>
        {config.label && !config.hideLabel ? <label htmlFor={this.props.id} className="ff-label">{this.props.config.label}</label> : ''}
        <textarea
          cols={config.cols || 30}
          rows={config.rows || 10}
          value={value}
          {...rest}
          onChange={this.handleInputChange}
          className="form-control">
        </textarea>
        <span className="error">{errorMsg}</span>
      </div>
    );
  }
}

export default TextAreaInput;
