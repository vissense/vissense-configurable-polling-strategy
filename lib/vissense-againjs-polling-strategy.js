/*global Strategy:true, VisSenseUtils:true, Again:true */
/**
 * @license
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
'use strict';

/**
 * @class
 * @name AgainJsPollingStrategy
 * @extends VisSense.VisMon.Strategy
 * @memberof VisSense.VisMon.Strategy
 *
 * @param {VisSense.VisMon.Strategy.AgainJsPollingStrategy#AgainJsPollingStrategyConfig} [config={}] The config object
 *
 * @classdesc A strategy that will periodically update the objects
 * visibility state. Configurable!
 *
 * @example
 *
 * var visMon = VisSense(...).monitor({
 *   strategy: new VisSense.VisMon.Strategy.AgainJsPollingStrategy({
 *     hidden: 5000
 *     visible: 3000,
 *     fullyvisible: 1000
 *   }),
 *   update: function() {
 *     console.log('updated.');
 *   }
 * }).start();
 *
 */
Strategy.AgainJsPollingStrategy = function (config) {
  var _config = VisSenseUtils.defaults(config, {
    fullyvisible: 1000,
    visible: 1000,
    hidden: 3000
  });

  this._startInternal = function (monitor) {

    var againjs = Again.create();

    var stopUpdate = monitor.on('visibilitychange', function (monitor) {
      console.log('[AgainJsPollingStrategy] update againjs timer with ' + monitor.state().state);
      againjs.update(monitor.state().state);
    });

    var stopAgainJs = againjs.every(function () {
      console.log('[AgainJsPollingStrategy] update monitor by AgainJs ' + monitor.state().state);
      monitor.update();
    }, _config);

    console.log('[AgainJsPollingStrategy] starting againjs timer with "' + monitor.state().state + '"');
    againjs.update(monitor.state().state);

    return function () {
      stopAgainJs();
      stopUpdate();
    };
  };
  this._stopInternal = null;

  this._started = false;
};
Strategy.AgainJsPollingStrategy.prototype = Object.create(
  Strategy.prototype
);
/**
 * @method
 * @name start
 *
 * @param {VisSense.VisMon} monitor
 *
 * @memberof VisSense.VisMon.Strategy.AgainJsPollingStrategy#
 */
Strategy.AgainJsPollingStrategy.prototype.start = function (monitor) {
  if (!this._started) {
    this._stopInternal = this._startInternal(monitor);
    this._started = true;
  }
  return this._started;
};
/**
 * @method
 * @name stop
 *
 * @param {VisSense.VisMon} monitor
 *
 * @memberof VisSense.VisMon.Strategy.AgainJsPollingStrategy#
 */
Strategy.AgainJsPollingStrategy.prototype.stop = function () {
  if (!this._started) {
    return false;
  }
  this._stopInternal();
  this._started = false;
  return true;
};
