import React, { Component } from "react";
import FormField from "./FormField";
// import moment from "moment";

const FIELD_PREFIX = "field-";
const DEFAULT_COLUMN_COUNT = 2;

class FormGroup extends Component {
  state = {
    data: {},
    fgConfig: {},
    requestMap: {}
  };
  defaults = {
    getFormGroupData: () => {}
  }
  formGroupData = { title: "", fields: [], ui: {} };
  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
    this.init();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.viewMode !== this.props.viewMode) {
      this.init();
    }
  }

  clear = () => {
    let { data, fgConfig } = this.state;
    let initVal = this.props.initVal || {};
    this.formGroupData.fields.map(fieldObj => {
      data[fieldObj.id] = initVal[fieldObj.id] || "";
    });
    this.setState({ data });
  };

  init = async () => {
    let { data, fgConfig } = this.state;
    this.formGroupData =
      this.props.config || FormGroup.getFormGroupData(this.props.groupId);
    let initVal = this.props.initVal || {};

    this.formGroupData.fields.map(fieldObj => {
      data[fieldObj.id] = initVal[fieldObj.id] || "";
    });
    let { ui = {} } = this.formGroupData;
    let uiViewModeConfig = (ui.viewModes || {})[this.props.viewMode];
    fgConfig.uiViewModeConfig = uiViewModeConfig;
    fgConfig.gridTemplateAreas = this.getGridTemplateAreas();
    fgConfig.gridTemplateColumns =
      uiViewModeConfig && uiViewModeConfig.gridTemplateColumns
        ? uiViewModeConfig.gridTemplateColumns
        : ui.gridTemplateColumns;
    fgConfig.containerOverrideStyles = ui.containerOverrideStyles;
    await this.setState({ data, fgConfig });
    if (this.props.focus)
      this[`${FIELD_PREFIX}${this.formGroupData.fields[0].id}`].focus();
  };

  update = this.init;

  componentWillUnmount() {
    this.props.onRef && this.props.onRef(null);
  }
  isValid = () =>
    this.formGroupData.fields
      .filter(ele => !ele.hidden)
      .map(ele => this[`${FIELD_PREFIX}${ele.id}`].isValid())
      .indexOf(false) === -1;

  validateAndGet({validate = true} = {}) {
    let { fields } = this.formGroupData;
    return fields
      .filter(ele => !ele.hidden)
      .map(ele => {
        let fieldRef = this[`${FIELD_PREFIX}${ele.id}`];
        return {
          valid: validate ? fieldRef.isValid() : true,
          value: fieldRef.val(),
          id: ele.id
        };
      });
  }

  val = () => {
    let fgData = {};
    let { data } = this.state;
    for (let fgKey in data) {
      if (typeof data[fgKey] !== "object") {
        fgData[fgKey] = data[fgKey];
      } else if (data[fgKey].value !== undefined) {
        fgData[fgKey] = data[fgKey].value;
      // } else if (moment.isMoment(data[fgKey])) {
      //   fgData[fgKey] = data[fgKey].valueOf();
      } else {
        fgData[fgKey] = "";
      }
    }
    return fgData;
  };

  onFormGroupChange = (newVal, fieldObj) => {
    let { data, requestMap } = this.state;
    data[fieldObj.id] = newVal;
    this.formGroupData.fields.map(v => {
      if (v.dependsOn === fieldObj.id) {
        requestMap[v.id] = { request: newVal.data || "" };
        // v.request = newVal.data || "";
        // return v;
      }
      // return v;
    });

    this.setState({ data, requestMap }, () => {
      if (this.props.onFormGroupChange) {
        this.debouncedOnFGChange();
      }
    });
  };

  debouncedOnFGChange = () => {
    this.props.onFormGroupChange(this.state);
  };

  getGridTemplateAreas = () => {
    let { title, fields, ui = {} } = this.formGroupData;
    let {stretchSingleField} = ui.containerOverrideStyles
    let columnCount = fields.length === 1 && stretchSingleField ? 1 : DEFAULT_COLUMN_COUNT;
    let uiViewModeConfig = (ui.viewModes || {})[this.props.viewMode];
    ui.gridTemplateAreas =
      (uiViewModeConfig || {}).gridTemplateAreas ||
      ui.gridTemplateAreas ||
      [...Array(Math.ceil(fields.length / columnCount))].map(
        (v, rowIndex) => {
          return [...Array(columnCount)]
            .map(
              (v, columnIndex) =>
                `${
                  (
                    fields[rowIndex * columnCount + columnIndex] || {
                      id: `emptyArea${columnIndex}`
                    }
                  ).id
                }`
            )
            .join(" ");
        }
      );

    let gridTemplateAreas = ui.gridTemplateAreas
      .map(row => `"${row}"`)
      .join("\n");

    return gridTemplateAreas;
  };
  blurTimeOut = null;
  onFocusFF = () => {
    window.clearTimeout(this.blurTimeOut);
  };
  onFocusFG = () => {
    window.clearTimeout(this.blurTimeOut);
  };
  onBlurFF = () => {
    this.blurTimeOut = window.setTimeout(() => {
      this.props.onBlur && this.props.onBlur();
      if (this.props.validateOnBlur) this.isValid();
    }, 300);
  };

  render() {
    let { title, fields, ui = {} } = this.formGroupData;
    let { data, fgConfig, requestMap } = this.state;
    let { extraConfig = {}, disabled = false, tabIndex } = this.props; //expecting {id: {config: config}} here

    let {
      uiViewModeConfig,
      gridTemplateAreas,
      gridTemplateColumns,
      containerOverrideStyles
    } = fgConfig;
    return (
      <div
        className={`form-group-container ${
          disabled ? "disable-overlay pos-rel" : ""
        }`}
        style={{
          display: "grid",
          margin: "12px 16px",
          gridGap: "16px 24px",
          gridTemplateAreas: gridTemplateAreas,
          gridAutoColumns: "1fr",
          outline: "none",
          ...({ gridTemplateColumns: gridTemplateColumns } || {}),
          ...(containerOverrideStyles || {})
        }}
        tabIndex={tabIndex}
        onFocus={this.onFocusFG}
      >
        {fields.map(fieldObj => {
          if (
            uiViewModeConfig &&
            uiViewModeConfig.fields &&
            uiViewModeConfig.fields[fieldObj.id]
          ) {
            fieldObj = {
              ...fieldObj,
              ...uiViewModeConfig.fields[fieldObj.id]
            };
          }
          if (extraConfig && extraConfig[fieldObj.id]) {
            fieldObj = {
              ...fieldObj,
              ...extraConfig[fieldObj.id]
            };
          }
          let { id, readonly, hidden, ...config } = fieldObj;
          if (hidden) return "";
          return (
            <div
              className="fg-container"
              key={`${this.props.groupId}-key-${id}`}
              style={{
                gridArea: id
              }}
            >
              <FormField
                controlled="true"
                {...(readonly ? { disabled: true } : {})}
                onChange={newVal => this.onFormGroupChange(newVal, fieldObj)}
                value={data[fieldObj.id]}
                onFocus={this.onFocusFF}
                onBlur={this.onBlurFF}
                config={{
                  ...(config || {}),
                  ...(requestMap[fieldObj.id] || {})
                }}
                onRef={ref => (this[`${FIELD_PREFIX}${id}`] = ref)}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default FormGroup;
export { FIELD_PREFIX };
