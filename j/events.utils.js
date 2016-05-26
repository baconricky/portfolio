// event management based on http://www.scottandrew.com/weblog/articles/cbs-events
// @ref http://www.scottandrew.com/weblog/articles/cbs-events

function addEvent(obj, evType, fn) { 
  if (obj.addEventListener) {
    obj.addEventListener(evType, fn, false);
    return obj;
  } else if (obj.attachEvent) {
    var r = obj.attachEvent('on'+evType, fn);
    return r;
  } else {
    return false;
  }
}

function removeEvent(obj, evType, fn) {
  if (obj.removeEventListener) {
    obj.removeEventListener(evType, fn, false);
    return obj;
  } else if (obj.detachEvent) {
    var r = obj.detachEvent('on'+evType, fn);
    return r;
  } else {
    return false;
  }
}
