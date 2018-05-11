import { regexes } from "../constants/regexes";

export const Validator = {
  validate: (validations, data) => {
    return new Promise((resolve, reject) => {
      let err = validateJSON(validations, data)
      err !== null ? reject(err) : resolve(data)
    });
  }
}

let validateJSON = (validations, data) => {
  let nodes = Object.keys(validations)
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i]
    let validation = validations[node]
    let value = data[node]
    if (validation.mandatory && (validation.invalid ? value === validation.invalid : !value)){
      return {
        node,
        message: validation.display_name + ' is mandatory'
      }
    }
    if (validation.invalid ? value === validation.invalid : !value) {
      continue
    }
    if (validation.type) {
      if (validation.type === 'number') {
        if (isNaN(value) || value < 0) {
          return {
            node,
            message: validation.display_name + ' is incorrect'
          }
        }
      } else if (validation.type === 'array') {
        if (!(value instanceof Array)) {
          return {
            node,
            message: validation.display_name + ' is incorrect'
          }
        }
      } else if (regexes[validation.type] && !regexes[validation.type].test(value)) {
        return {
          node,
          message: validation.display_name + ' is incorrect'
        }
      } else if (validation.type === 'object') {
        return validateJSON(validation.nodes, value)
      }
    }
    let length = value.length
    if (validation.length && length !== validation.length) {
      return {
        node,
        message: validation.display_name + ' must be ' + validation.length + ' ' + (validation.type === 'number' ? 'digits' : 'characters')
      }
    }
    if (validation.min_length && length < validation.min_length) {
      return {
        node,
        message: 'Select atleast ' + validation.length + ' ' + validation.display_name
      }
    }
    if (validation.handleConditions) {
      let err = validation.handleConditions(data)
      if (err != null) {
        return err
      }
    }
  }
  return null;
}

let AddressValidations = {
  display_name: 'Address',
  mandatory: true,
  type: 'object',
  nodes: {
    street: {
      display_name: 'Street',
      type: 'string',
      mandatory: true
    },
    area: {
      display_name: 'Area',
      type: 'string',
      mandatory: true
    },
    city: {
      display_name: 'City',
      type: 'string',
      mandatory: true
    },
    pincode: {
      display_name: 'Pincode',
      type: 'number',
      mandatory: true
    },
  }
}

export const LoginValidations = {
  email: {
    display_name: 'Email',
    type: 'email',
    mandatory: true
  },
  password: {
    display_name: 'Password',
    mandatory: true
  }
}

export const ExistingTrainerValidations = {
  user_id: {
    display_name: 'User ID',
    type: 'number',
    mandatory: true,
  },
}

export const TrainerValidations = {
  mobile: {
    display_name: 'Mobile Number',
    type: 'number',
    length: 10
  },
  name: {
    display_name: 'Name',
    mandatory: true
  },
  email: {
    display_name: 'Email',
    type: 'email'
  },
  gender: {
    display_name: 'Gender',
    type: 'gender',
    mandatory: true
  },
  dob: {
    display_name: 'Date of Birth',
    type: 'date',
    mandatory: true
  },
  mobile_alternate: {
    display_name: 'Notification Mobile Number',
    type: 'number',
    mandatory: true,
    length: 10
  },
  address: {
    ...AddressValidations
  }
}

export const PlanValidations = {
  sports: {
    display_name: 'Sport',
    type: 'sport',
    mandatory: true,
    min_length: 1
  },
  name: {
    display_name: 'Name',
    mandatory: true
  },
  max_entries: {
    display_name: 'Maximum Entries',
    type: 'number'
  },
  arena_id: {
    display_name: 'Venue',
    type: 'number',
    mandatory: true
  },
  from_date: {
    display_name: 'From Date',
    type: 'date',
    mandatory: true
  },
  to_date: {
    display_name: 'To Date',
    type: 'date'
  },
  days: {
    display_name: 'Day(s)',
    type: 'array',
    mandatory: true,
    min_length: 1
  },
  from_time: {
    display_name: 'From Time',
    type: 'time',
    mandatory: true
  },
  to_time: {
    display_name: 'To Time',
    type: 'time',
    mandatory: true
  },
  // Temporarily commented. Since this is not jsonschema, need to write as per this custom validation
  // fees: {
  //   display_name: 'Fees',
  //   type: 'number',
  //   mandatory: true
  // },
  // bill_cycle: {
  //   display_name: 'Billing Cycle',
  //   type: 'number',
  //   mandatory: true,
  //   invalid: -1,
  //   handleConditions: (data) => {
  //     if (data.bill_cycle === 0 && !data.to_date) {
  //       return {
  //         node: 'to_date',
  //         message: 'To Date is mandatory for onetime Class / Plan'
  //       }
  //     }
  //     return null
  //   }
  // },
  due_after: {
    display_name: 'Due After',
    type: 'number',
    mandatory: true
  }
}

export const ClassValidations = {
  ...PlanValidations,
  trainer_id: {
    display_name: 'Trainer',
    type: 'number',
    mandatory: true
  }
}

export const ExistingCustomerValidations = {
  ...ExistingTrainerValidations,
  doj: {
    display_name: 'Date of Joining',
    type: 'date',
    mandatory: true
  }
}

export const CustomerValidations = {
  ...TrainerValidations,
  doj: {
    display_name: 'Date of Joining',
    type: 'date',
    mandatory: true
  }
}

export const EnrollPlayerValidations = {
  fees: {
    display_name: 'Fees',
    type: 'number',
    mandatory: true
  },
  ends_after: {
    display_name: 'Ends After',
    type: 'number'
  }
}