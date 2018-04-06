import React, { PureComponent } from 'react';

export default class AsyncLib extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      Component: null,
    };
  }

  componentWillMount() {
    if (!this.state.Component) {
      this.props.moduleProvider.then((Component) => {
        this.setState({
          Component: this.props.modKey ? Component[this.props.modKey] : Component
        },()=>{
          if(this.props.onRef){
            this.props.onRef(this.component);
          } else {
            console.error("define onRef function")
          }
        });
      });
    }
  }


  componentWillUnmount(){
    if(this.props.onRef) this.props.onRef(null);
  }

  render() {
    const { Component } = this.state;
    //so modKey is basically the key inside the promise object the library's constructor is.
    const {modKey, moduleProvider, onRef, ...actualProps} = this.props;

    // The magic happens here!
    return (
      <div>
        {Component ? <Component {...actualProps} ref={k => this.component = k}/> : (<div className="loader-s"/>)}
      </div>
    );
  }
}

const AsyncVKeyboard = props => <AsyncLib moduleProvider={import(/* webpackChunkName: "v-keyboard" */'react-virtual-keyboard')} modKey="default" {...props}/>


export {AsyncVKeyboard};
