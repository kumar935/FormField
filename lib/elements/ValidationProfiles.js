const ERROR_MSGS = {
  DEFAULT: "There was an error",
  FIELD_EMPTY: "This field cannot be empty",
  PWD_INVALID:
    "Password should contain at least one uppercase alphabet, digit and a special character (!, @, $, %)",
  FAILED: "failed",
  INVALID_EMAIL: "Please enter a valid email ID",
  INVALID_CIVILID: "Invalid Civil Id format",
  SP_CH_NOT_ALLOWED: "Special character not allowed",
  NO_SPACES: "No spaces allowed",
  THESE_SP_CH_NOT_ALLOWED:
    "This special character is not allowed. Characters allowed are  ! @ $ and %",
  NO_NUMBERS: "Numbers are not allowed",
  ONLY_ALPHABETS:
    "Please enter valid input (alphabets with special characters allowed [-], [.], [:], ['])",
  INVALID_INPUT: "Please enter valid input",
  ONLY_NUMBERS: "Only numbers are allowed",
  ONLY_ARABIC: "Only Arabic characters allowed"
};

const err = (type, config) => {
  return {
    MAX_LEN_ERR: `Length of ${config.label} should be less than ${config.max} ${
      config.numOrChar
    }`
  }[type];
};

const defaultConfig = {
  label: "this field",
  hiddenLabel: "this field"
};

const validationProfilesConfig = {
  default(val, config) {
    config = config || defaultConfig;
    config.label = config.label || config.hiddenLabel;
    if (config.type === "currency") {
      val = (val || {}).value;
    }
    if (val === "" || val === null || val === undefined) {
      // let emptyErr = I18n(`g.msg.fieldempty:${config.label}`);
      let emptyErr =
        config.emptyErr ||
        `Please enter ${config.label || config.hiddenLabel || "this field"}`;
      return {
        valid: false,
        errorMsg: emptyErr
      };
    } else if (config.sizeRange) {
      let min = config.sizeRange[0] || 0;
      let max = config.sizeRange[1] || Infinity;
      if (
        (config.type === "number" || config.type === "currency") &&
        typeof val === "number"
      ) {
        val = String(val).split(".")[0];
      }
      if (val.length <= max && val.length >= min) {
        return {
          valid: true
        };
      } else {
        let errorMsg = "";
        let numOrChar = config.type === "number" ? "digits" : "characters";
        if (min < 0 && max > 0) {
          errorMsg = `Length of ${
            config.label
          } should be less than ${max} ${numOrChar}`;
          // errorMsg = I18n(`g.msg.maxlenerr:${config.label}:${max}:${numOrChar}`);
        } else if (max < 0 && min > 0) {
          errorMsg = `Length of ${
            config.label
          } should be greater than ${min} ${numOrChar}`;
          // errorMsg = I18n(`g.msg.minlenerr:${config.label}:${min}:${numOrChar}`);
        } else if (min >= 0 && max >= 0) {
          if (min === max) {
            errorMsg = `Length of ${
              config.label
            } should be ${min} ${numOrChar}`;
            // errorMsg = I18n(`g.msg.exlenerr:${config.label}:${min}:${numOrChar}`);
          } else {
            errorMsg = `Length of ${
              config.label
            } should be between ${min} and ${max} ${numOrChar}`;
            // errorMsg = I18n(`g.msg.minmaxlenerr:${config.label}:${min}:${max}:${numOrChar}`);
          }
        } else {
          errorMsg = ERROR_MSGS.INVALID_INPUT;
        }
        return {
          valid: false,
          errorMsg
        };
      }
    } else if (config.allowedSizes) {
      let allowedSizes = config.allowedSizes || [];
      if (allowedSizes.length === 0) return { valid: true };
      if (allowedSizes.indexOf(val.length.toString()) === -1) {
        let errorMsg = ERROR_MSGS.INVALID_INPUT;
        if (allowedSizes.length === 1) {
          errorMsg = `Mobile number length should be ${allowedSizes[0]} digits`;
          // errorMsg = I18n(`g.msg.moblenerr:${allowedSizes[0]}`);
        } else {
          errorMsg = `Mobile number length should be either of ${allowedSizes.join(
            ", "
          )} digits`;
          // errorMsg = I18n(`g.msg.moblenerr1:${allowedSizes.join(", ")}`);
        }
        return {
          valid: false,
          errorMsg
        };
      } else {
        return { valid: true };
      }
    } else {
      return {
        valid: true
      };
    }
  },
  noSpaces(val) {
    let containsSpace = /\s/g.test(val);
    return {
      valid: !containsSpace,
      errorMsg: ERROR_MSGS.NO_SPACES
    };
  },
  noNumbers(val) {
    let hasNumber = /\d/.test(val);
    return {
      valid: !hasNumber,
      errorMsg: ERROR_MSGS.NO_NUMBERS
    };
  },
  theseSpChNotAllowed(val) {
    let containsUnwantedSpChars = /[#^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(
      val
    );
    return {
      valid: !containsUnwantedSpChars,
      errorMsg: ERROR_MSGS.THESE_SP_CH_NOT_ALLOWED
    };
  },
  sentenceCase(val) {
    let words = val.split(" ");
    let sentenceCasified = words
      .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
    return {
      valid: words === sentenceCasified,
      corrected: sentenceCasified,
      errorMsg: ERROR_MSGS.INVALID_INPUT
    };
  },
  password(val) {
    let containsDigits = /[0-9]/.test(val);
    let containsUpper = /[A-Z]/.test(val);
    let containsLower = /[a-z]/.test(val);
    let containsSpecialChars = /[!@%$]/.test(val);
    let containsUnwantedSpChars = /[#^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(
      val
    );

    if (
      containsDigits &&
      containsUpper &&
      containsLower &&
      containsSpecialChars &&
      !containsUnwantedSpChars
    ) {
      return {
        valid: true
      };
    } else {
      return {
        valid: false,
        errorMsg: ERROR_MSGS.PWD_INVALID
      };
    }
  },
  email(val) {
    let valid = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(
      val
    );
    return {
      valid,
      errorMsg: ERROR_MSGS.INVALID_EMAIL
    };
  },
  civilid(val) {
    let valid = !isNaN(val) && val.toString().indexOf(".") === -1;
    return {
      valid,
      errorMsg: ERROR_MSGS.INVALID_CIVILID
    };
  },
  spCharacterNotAllowed(val) {
    let notAllowed = /[ `~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val);
    return {
      valid: !notAllowed,
      errorMsg: ERROR_MSGS.SP_CH_NOT_ALLOWED
    };
  },
  onlyAlphabets(val) {
    let valid = /[a-z ,.'-]+/.test(val);
    return {
      valid: valid,
      errorMsg: ERROR_MSGS.ONLY_ALPHABETS
    };
  },
  onlyNumbers(val) {
    return {
      valid: !isNaN(val),
      errorMsg: ERROR_MSGS.ONLY_NUMBERS
    };
  },
  onlyArabicChars(val) {
    let valid = /[\u0621-\u064A\u0660-\u0669 ]+/.test(val);
    return {
      valid,
      errorMsg: ERROR_MSGS.ONLY_ARABIC
    };
  },
  currencyInput(val) {
    let isPositive = val >= 0;
    let containsLeadingZeros = false;
    let newValue = val.replace(/^0+/, "");
    if (val !== "0" && val.indexOf("0.") !== 0 && newValue !== val) {
      containsLeadingZeros = true;
    }
    let valid = isPositive && !containsLeadingZeros;
    return {
      valid,
      errorMsg: ERROR_MSGS.INVALID_INPUT
    };
  },
  validName(val) {
    let valid = /^(?![0-9 ]*$)[a-zA-Z0-9 ]+$/.test(val);
    return {
      valid,
      errorMsg: ERROR_MSGS.INVALID_INPUT
    };
  },
  validOTP(val) {
    let valid = !isNaN(val.substr(4));
    return {
      valid,
      errorMsg: ERROR_MSGS.INVALID_INPUT
    };
  }
};

export { validationProfilesConfig, ERROR_MSGS };
