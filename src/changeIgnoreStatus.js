"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function(defaultFuncs, api, ctx) {
  return function changeIgnoreStatus(threadOrThreads, callback) {
    if (!callback) {
      callback = function() {};
    }

    var form = {};

    if (utils.getType(threadOrThreads) === "Array") {
      for (var i = 0; i < threadOrThreads.length; i++) {
        form["other[" + i + "]"] = threadOrThreads[i];
      }
    } else {
      form["other[0]"] = threadOrThreads;
    }
    
    defaultFuncs
      .post(
        "https://www.facebook.com/ajax/mercury/move_thread.php",
        ctx.jar,
        form
      )
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function(resData) {
        if (resData.error) {
          throw resData;
        }

        return callback();
      })
      .catch(function(err) {
        log.error("changeIgnoreStatus", err);
        return callback(err);
      });
  };
};
