import {ERROR_MSGS} from "./Constants";
export const validationProfilesConfig = {
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
