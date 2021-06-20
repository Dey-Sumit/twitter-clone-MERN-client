// https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site

function timeSince(date: Date): string {
  var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " y";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " mon";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " d";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " h";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " m";
  }
  return Math.floor(seconds) + " s";
}
//   var aDay = 24*60*60*1000;
//   console.log(timeSince(new Date(Date.now()-aDay*2)));
//   console.log(timeSince(new Date(Date.now()-aDay)));

export default timeSince;
