import styled from 'styled-components';

let styleDefaults = {
  color: "#4a70e4",
  selectStyle: "default"
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
    color: ${props => props.color || styleDefaults.color};
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
    color: ${props => props.color || styleDefaults.color};
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
    background: ${props => props.color || styleDefaults.color};
    height: 1px;
    transition: all 0.5s;
  }
`;


const DefaultSelectWrapper = styled.div`
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
    color: ${props => props.color || styleDefaults.color};
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
`;

const LinedSelectWrapper = DefaultSelectWrapper.extend`
   height: 56px;
   &.label {
    padding-top: 0;
   }
  .Select {
    position: relative;
    max-height: inherit;
  }
  .Select input::-webkit-contacts-auto-fill-button,
  .Select input::-webkit-credentials-auto-fill-button {
    display: none !important;
  }
  .Select input::-ms-clear {
    display: none !important;
  }
  .Select input::-ms-reveal {
    display: none !important;
  }
  .Select,
  .Select div,
  .Select input,
  .Select span {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .Select.is-disabled .Select-arrow-zone {
    cursor: default;
    pointer-events: none;
    opacity: 0;
  }
  .Select.is-disabled {
    opacity:1;
  }
  .Select.is-disabled > .Select-control:hover {
    box-shadow: none;
  }
  .Select.is-open > .Select-control {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    background: transparent;
    border-color: #b3b3b3 #ccc #d9d9d9;
  }
  .Select.is-open > .Select-control .Select-arrow {
    top: -2px;
    border-color: transparent transparent #999;
    border-width: 0 5px 5px;
  }
  .Select.is-searchable.is-open > .Select-control {
    cursor: text;
  }
  .Select.is-searchable.is-focused:not(.is-open) > .Select-control {
    cursor: text;
  }
  .Select.is-focused > .Select-control {
    background: #fff;
  }
  .Select.is-focused:not(.is-open) > .Select-control {
    border-color: transparent;
    box-shadow: none;
    background: #fff;
  }
  .Select.has-value.is-clearable.Select--single > .Select-control .Select-value {
    padding-right: 42px;
  }
  .Select.has-value.Select--single > .Select-control .Select-value .Select-value-label,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value .Select-value-label {
    color: #333;
  }
  .Select.has-value.Select--single > .Select-control .Select-value a.Select-value-label,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value a.Select-value-label {
    cursor: pointer;
    text-decoration: none;
  }
  .Select.has-value.Select--single > .Select-control .Select-value a.Select-value-label:hover,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value a.Select-value-label:hover,
  .Select.has-value.Select--single > .Select-control .Select-value a.Select-value-label:focus,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value a.Select-value-label:focus {
    color: transparent;
    outline: none;
    text-decoration: underline;
  }
  .Select.has-value.Select--single > .Select-control .Select-value a.Select-value-label:focus,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value a.Select-value-label:focus {
    background: #fff;
  }
  .Select.has-value.is-pseudo-focused .Select-input {
    opacity: 0;
  }
  .Select.is-open .Select-arrow,
  .Select .Select-arrow-zone:hover > .Select-arrow {
    border-top-color: #666;
  }
  .Select.Select--rtl {
    direction: rtl;
    text-align: right;
  }
  .Select-control {
    background-color: #ffffff;
    border-color: #d9d9d9 #ccc #b3b3b3;
    border-radius: 4px;
    border: 0 solid transparent;
    color: #333;
    cursor: default;
    display: table;
    border-spacing: 0;
    border-collapse: separate;
    height: 36px;
    outline: none;
    overflow: hidden;
    position: relative;
    width: 100%;
  }
  .Select-control:hover {
    box-shadow: none;
  }
  .Select-control .Select-input:focus {
    outline: none;
    background: #fff;
  }
  .Select-placeholder,
  .Select--single > .Select-control .Select-value {
    bottom: 0;
    color: #aaa;
    left: 0;
    line-height: inherit;
    padding-left: 0;
    padding-right: 10px;
    position: absolute;
    right: 0;
    top: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .Select-input {
    height: 34px;
    padding-left: 0;
    padding-right: 10px;
    vertical-align: middle;
  }
  .Select-input > input {
    width: 100%;
    background: none transparent;
    border: none;
    box-shadow: none;
    cursor: default;
    display: inline-block;
    font-family: inherit;
    font-size: inherit;
    margin: 0;
    outline: none;
    line-height: 17px;
    /* For IE 8 compatibility */
    padding: 8px 0 12px;
    /* For IE 8 compatibility */
    -webkit-appearance: none;
  }
  .is-focused .Select-input > input {
    cursor: text;
  }
  .has-value.is-pseudo-focused .Select-input {
    opacity: 0;
  }
  .Select-control:not(.is-searchable) > .Select-input {
    outline: none;
  }
  .Select-loading-zone {
    cursor: pointer;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: 16px;
  }
  .Select-loading {
    -webkit-animation: Select-animation-spin 400ms infinite linear;
    -o-animation: Select-animation-spin 400ms infinite linear;
    animation: Select-animation-spin 400ms infinite linear;
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border-radius: 0;
    border: 0 solid #ccc;
    border-right-color: #333;
    display: inline-block;
    position: relative;
    vertical-align: middle;
  }
  .Select-clear-zone {
    -webkit-animation: Select-animation-fadeIn 200ms;
    -o-animation: Select-animation-fadeIn 200ms;
    animation: Select-animation-fadeIn 200ms;
    color: #999;
    cursor: pointer;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: 17px;
  }
  .Select-clear-zone:hover {
    color: #D0021B;
  }
  .Select-clear {
    display: inline-block;
    font-size: 18px;
    line-height: 1;
  }
  .Select--multi .Select-clear-zone {
    width: 17px;
  }
  .Select-arrow-zone {
    cursor: pointer;
    display: table-cell;
    position: relative;
    top: -5px;
    text-align: center;
    vertical-align: middle;
    width: 25px;
    padding-right: 5px;
  }
  .Select--rtl .Select-arrow-zone {
    padding-right: 0;
    padding-left: 5px;
  }
  .Select-arrow {
    border-color: #999 transparent transparent;
    border-style: solid;
    border-width: 5px 5px 2.5px;
    display: inline-block;
    height: 0;
    width: 0;
    position: relative;
  }
  .Select-control > *:last-child {
    padding-right: 5px;
  }
  .Select--multi .Select-multi-value-wrapper {
    display: inline-block;
  }
  .Select .Select-aria-only {
    position: absolute;
    display: inline-block;
    height: 1px;
    width: 1px;
    margin: -1px;
    clip: rect(0, 0, 0, 0);
    overflow: hidden;
    float: left;
  }
  @-webkit-keyframes Select-animation-fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes Select-animation-fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .Select-menu-outer {
    border-radius: 0;
    border: 0 solid transparent;
    -webkit-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.47);
    -moz-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.47);
    box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.47);
  
    box-sizing: border-box;
    margin-top: -21px;
    max-height: 200px;
    position: absolute;
    top: 100%;
    width: 100%;
    line-height: 36px !important;
    background: white;
    z-index: 100;
    -webkit-overflow-scrolling: touch;
  }
  .Select-menu {
    max-height: 198px;
    overflow-y: auto;
  }
  .Select-option {
    box-sizing: border-box;
    background-color: #fff;
    color: #666666;
    cursor: pointer;
    display: block;
    padding: 0 10px;
  }
  .select-box.full-height{
  .Select-menu-outer{
    max-height: inherit;
  }
  .Select-menu {
    max-height: inherit;
  }
  }
  .select-box.open-up{
  .Select-menu-outer {
    top: auto;
    bottom: 100%;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    border-bottom-right-radius: unset;
    border-bottom-left-radius: unset;
  }
  .Select-option:first-child {
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
  }
  .Select-option:last-child {
    border-bottom-right-radius: unset;
    border-bottom-left-radius: unset;
  }
  .Select.is-open > .Select-control {
    border-top-right-radius: unset;
    border-top-left-radius: unset;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  }
  .Select-option:last-child {
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  .Select-option.is-selected {
  //background-color: #9ffdb6;
  ///* Fallback color for IE 8 */
  //background-color: #9ffdb6;
    color: #333;
  }
  .Select-option.is-focused {
    background-color: #33bb55;
    color: #fff;
  }
  .Select-option.is-disabled {
    color: #cccccc;
    cursor: default;
  }
  .Select-noresults {
    box-sizing: border-box;
    color: #999999;
    cursor: default;
    display: block;
    padding: 8px 10px;
  }
  .Select--multi .Select-input {
    vertical-align: middle;
    margin-left: 10px;
    padding: 0;
  }
  .Select--multi.Select--rtl .Select-input {
    margin-left: 0;
    margin-right: 10px;
  }
  .Select--multi.has-value .Select-input {
    margin-left: 5px;
  }
  .Select--multi .Select-value {
    background-color: #9ffdb6;
    border-radius: 0;
    border: 0 solid transparent;
    color: #000;
    display: inline-block;
    font-size: 0.9em;
    line-height: 1.4;
    margin-left: 5px;
    margin-top: 5px;
    vertical-align: top;
  }
  .Select--multi .Select-value-icon,
  .Select--multi .Select-value-label {
    display: inline-block;
    vertical-align: middle;
  }
  .Select--multi .Select-value-label {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    cursor: default;
    padding: 2px 5px;
  }
  .Select--multi a.Select-value-label {
    color: #000;
    cursor: pointer;
    text-decoration: none;
  }
  .Select--multi a.Select-value-label:hover {
    text-decoration: underline;
  }
  .Select--multi .Select-value-icon {
    cursor: pointer;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    border-right: 0px solid #9ffdb6;
    /* Fallback color for IE 8 */
    border-right: 0px solid #9ffdb6;
    padding: 1px 5px 3px;
  }
  .Select--multi .Select-value-icon:hover,
  .Select--multi .Select-value-icon:focus {
    background-color: #9ffdb6;
    color: #000;
  }
  .Select--multi .Select-value-icon:active {
    background-color: #9ffdb6;
  }
  .Select--multi.Select--rtl .Select-value {
    margin-left: 0;
    margin-right: 5px;
  }
  .Select--multi.Select--rtl .Select-value-icon {
    border-right: none;
    /* Fallback color for IE 8 */
    border-left: 0 solid #9ffdb6;
  }
  .Select--multi.is-disabled .Select-value {
    background-color: #fcfcfc;
    border: 0 solid #e3e3e3;
    color: #333;
  }
  .Select--multi.is-disabled .Select-value-icon {
    cursor: not-allowed;
    border-right: 0 solid #e3e3e3;
  }
  .Select--multi.is-disabled .Select-value-icon:hover,
  .Select--multi.is-disabled .Select-value-icon:focus,
  .Select--multi.is-disabled .Select-value-icon:active {
    background-color: #fcfcfc;
  }
  @keyframes Select-animation-spin {
    to {
      transform: rotate(1turn);
    }
  }
  @-webkit-keyframes Select-animation-spin {
    to {
      -webkit-transform: rotate(1turn);
    }
  }
`

export {
  InputWrapper,
  Input,
  Label,
  Line,
  DefaultSelectWrapper,
  LinedSelectWrapper
}

export {styleDefaults}
