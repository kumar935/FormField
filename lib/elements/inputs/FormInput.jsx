import React, { Component } from "react";

class FormInput extends Component {
  constructor() {
    super();
    this.input = React.createRef();
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef && this.props.onRef(this);
  }

  handleInputChange(e) {
    this.props.onInputChange(e.target.value);
  }

  render() {
    return <input type="text" onChange={this.handleInputChange} />;
  }
}

export default FormInput;
