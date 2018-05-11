import * as Cookies from 'js-cookie'
import moment from 'moment'

/**
 * input '2017-05-31' => output '31 May 2017'
 * @param {String} d - sql date format: 2017-05-31
 */
export const getDisplayDate = (d) => {
  return d ? moment(d).format('DD MMM YYYY') : ""
}

export const getDisplayTime = (t) => {
  if (t) {
    try {
      let am = true
      let values = t.split(':')
      let hour = parseInt(values[0], 10)
      if (hour >= 12) {
        am = false
      }
      hour = parseInt(hour, 10) % 12
      if (hour === 0) {
        hour = 12
      }
      return (hour < 10 ? ("0" + hour) : hour) + ':' + values[1] + ' ' + (am ? 'AM' : 'PM')
    } catch (e) {
      console.log(e)
      return ""
    }
  }
  return ""
}

export const getTodayDate = () => {
  let today = new Date();
  let date = today.getDate();
  let month = today.getMonth() + 1; //January is 0!
  let year = today.getFullYear();

  if (date < 10) {
    date = '0' + date
  } 
  if (month < 10) {
    month = '0'+ month
  } 

  return year + '-' + month + '-' + date
}

export const getUrlParameter = (param) => {
  var results = window.location.search.match('[\\?&]' + param + '=([^&#]*)');
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

export const addOrRemoveUrlParameter = (key, value, url) => {
  let rtn = (url && url.split("?")[0]) || window.location.pathname
  let params_arr = []
  let search = window.location.search
  if (url) {
    search = url && "?" + url.split("?")[1]
  }
  if (search.includes) {
      let queryString = search.split("?")[1]
      if (queryString) {
        params_arr = queryString.split("&");
        params_arr.forEach((param, index) => {
          param = param.split("=")[0];
          if (param === key) {
              params_arr.splice(index, 1);
          }
        })
      }
  }
  if (value) {
    params_arr.push(key + "=" + value)
  }
  rtn = rtn + "?" + params_arr.join("&");
  return rtn;
}

export const getAPIBaseUrl = () => {
  let val = Cookies.get("ontro-biz-base-url") 
  if (val) {
    console.log('cookie' , val)
    return val
  } else if (window.location.host.includes('ontrobiz')) { // For Custom Domains
    let arr = window.location.host.split('.')
    arr.splice(1, 0, 'api')
    console.log('url' , window.location.protocol + '//' + arr.join('.'))
    return window.location.protocol + '//' + arr.join('.')
  } else {
    console.log('env', process.env.REACT_APP_BASE_URL)
    return process.env.REACT_APP_BASE_URL
  }
}

export const getTimeList = () => {
  let values = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute = minute + 15) {
      let value = ""
      value += hour < 10 ? ("0" + hour) : hour
      value += ":"
      value += minute < 10 ? ("0" + minute) : minute
      values.push(value)
    }
  }
  return values
}