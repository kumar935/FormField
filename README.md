# FormField
A react component for making forms easy.

# Installation

```
yarn add @kumar935/formfield
```

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
