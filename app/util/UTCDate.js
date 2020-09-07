import moment from 'moment';

export function UTCDate(date){
  // console.log('>>>>>>>>in class' ,date.toISOString());
  // new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
  return moment(date).format('YYYY-MM-DD')

}