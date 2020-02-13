const REGEX_SPLITTER = "REGEX_SPLITTER";

const validationService = {
  regexpStringToObj(regexpString){
    let regexpMatcher = /\/(.+)\/([gmiyus]{0,6})/;
    let regexpWithoutSlashes = regexpString.replace(regexpMatcher, `$1${REGEX_SPLITTER}$2`);
    return new RegExp(...regexpWithoutSlashes.split(REGEX_SPLITTER));
  },
  validRegex(str) {
    let isValid = true;
    try {
        new RegExp(str);
    } catch(e) {
        isValid = false;
    }
    return isValid;
  },
  validate(validators, {value, config}){
    let results = [];
    for(let i=0; i<validators.length; i++){
      let validator = validators[i];
      if(validator) results.push(validator(value, config));
    }
    return results;
  }
}

export default validationService;
