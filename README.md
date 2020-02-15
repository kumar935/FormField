# FormField
A react component for making forms easy.
[Codesandbox demo](https://codesandbox.io/s/charming-thunder-wszxx?fontsize=14&hidenavigation=1&theme=dark)

# Installation

```
yarn add @kumar935/formfield
```

# FormField Options

### Input Types

- text
- number
- password
- custom-pwd (this one prevents browser from asking you to save password)
- textarea
- radio
- select
- checkbox
- date
- currency (comma separates the currency)
- otp (prefixes the otp with otp prefix)

### Input Props

- config.label
- config.options (for select, radio and checkbox)
- controlled (by default false)
- onChange
- onRef
- disabled
- value (when controlled is true)


# Usage

```jsx harmony
import { FormField } from '@kumar935/formfield';

class App extends Component {
  constructor(){
    super();
    this.onClickSubmit = this.onClickSubmit.bind(this);
  }
  onClickSubmit() {
    if ([
      this.textInput.isValid(),
      this.numberInput.isValid(),
      this.pwdInput.isValid(),
      this.selectInput.isValid()
    ].indexOf(false) !== -1) return;
    alert(`what up: ${this.textInput.getValue()}`);
  }
  render() {
    return (
      <div>
        <h1>Hello!</h1>
        <FormField
          config={{
            type: 'text',
            label: 'Text Input'
          }}
          onRef={ref => this.textInput = ref}
        />

        <FormField
          config={{
            type: 'number',
            label: 'Number Input'
          }}
          onRef={ref => this.numberInput = ref}
        />


        <FormField
          config={{
            type: 'custom-pwd',
            label: 'Password Input'
          }}
          onRef={ref => this.pwdInput = ref}
        />

        <FormField
          config={{
            type: 'select',
            label: 'Select Input',
            options: [
              {value: "Rio", label: "Rio"},
              {value: "Tokyo", label: "Tokyo"},
              {value: "Nairobi", label: "Nairobi"}
            ]
          }}
          onRef={ref => this.selectInput = ref}
        />
        <br/><br/><br/>
        <button onClick={this.onClickSubmit}>Submit</button>
      </div>
    );
  }
}
```

# FormGroup

This component accepts a configuration of fields and there placement and renders a Form on the basis of that configuration.

```jsx harmony

const config = {
  "title": "Personal Details",
  "fields": [
    {
      "id": "identityInt",
      "type": "number",
      "label": "Civil ID",
      "readonly": true
    },
    {
      "id": "issueDate",
      "type": "date",
      "label": "Passport Issue Date",
      "dateValidator": "notFuture",
      "dateFormat": "DD/MM/YY",
      "hidden": true
    },
    {
      "id": "expiryDate",
      "type": "date",
      "dateFormat": "DD/MM/YY",
      "dateValidator": "notPast",
      "label": "Civil ID Expiry"
    },
    {
      "id": "countryId",
      "type": "countrylist",
      "label": "Residency Country",
      "readonly": true
    },
    {
      "id": "nationalityId",
      "type": "nationalitylist",
      "label": "Nationality"
    },
    {
      "id": "dateOfBirth",
      "type": "date",
      "dateFormat": "DD/MM/YY",
      "dateValidator": "above18",
      "label": "Date of Birth"
    },
    {
      "id": "title",
      "type": "nameprefixlist",
      "label": "Prefix"
    },
    {
      "id": "firstName",
      "type": "text",
      "label": "First Name"
    }
  ],
  "ui": {
    "gridTemplateAreas": [
      "identityInt . expiryDate . countryId countryId countryId",
      "nationalityId . dateOfBirth . title . firstName",
      "insurance . . . . . ."
    ],
    "gridTemplateColumns": "10fr 1fr 10fr 1fr 2fr 1fr 7fr",
    "containerOverrideStyles": {
      "columnGap": 0
    }
  }
}
```

Now To use this config simply pass it to the FormGroup component

```jsx harmony

<FormGroup config={config} onRef={ref => this.fg = ref}/>


```
