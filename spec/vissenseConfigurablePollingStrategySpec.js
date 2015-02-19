/*global $,VisSense,describe,it,expect,jasmine,beforeEach,spyOn,afterEach*/
/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
describe('VisSensePluginAgainJsPollingStrategy', function () {
  'use strict';

  function fireScrollEvent() {
    var event = document.createEvent('Event');
    event.initEvent('scroll', true, true);
    window.dispatchEvent(event);
  }

  function showHide(element, config) {
    if(!config.show) {
      throw new Error('missing config.show');
    } else if(!config.hide) {
      throw new Error('missing config.hide');
    }

    setTimeout(function () {
      element.style.display = 'block';
      fireScrollEvent();
    }, config.show);

    setTimeout(function () {
      element.style.display = 'none';
      fireScrollEvent();
    }, config.hide);
  }

  describe('Tests', function () {
    var element, visobj, observer;

    beforeEach(function () {
      jasmine.getFixtures().set('<div id="element" style="width: 1px; height: 1px;"></div>');

      element = $('#element')[0];
      visobj = new VisSense(element);

      observer = {callback: VisSense.Utils.noop};
      spyOn(observer, 'callback');

      jasmine.clock().install();

      jasmine.clock().mockDate();
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    it('should create a AgainJsPollingStrategy', function () {
      var strategy = new VisSense.VisMon.Strategy.AgainJsPollingStrategy();

      expect(strategy).toBeDefined();
    });

    it('should not be possible to start the Strategy multiple times', function () {
      var monitor = visobj.monitor({
        strategy: []
      });

      var strategy = new VisSense.VisMon.Strategy.AgainJsPollingStrategy();

      expect(strategy.start(monitor)).toBe(true);
      expect(strategy.start(monitor)).toBe(true);
      expect(strategy.start(monitor)).toBe(true);
      expect(strategy.stop(monitor)).toBe(true);
      expect(strategy.stop(monitor)).toBe(false);
    });

    it('should create a monitor with an AgainJsPollingStrategy', function () {
      var monitor = visobj.monitor({
        strategy: new VisSense.VisMon.Strategy.AgainJsPollingStrategy(),
        update: function () {
          observer.callback();
        }
      });

      expect(observer.callback).not.toHaveBeenCalled();

      monitor.start();

      expect(observer.callback.calls.count()).toEqual(1);

      jasmine.clock().tick(1000);
      expect(observer.callback.calls.count()).toEqual(2);

      monitor.stop();

      jasmine.clock().tick(999);
      jasmine.clock().tick(9999);
      jasmine.clock().tick(99999);
      expect(observer.callback.calls.count()).toEqual(2);

    });

    it('should create a monitor with an AgainJsPollingStrategy that updates more frequently when visible', function () {
      var monitor = visobj.monitor({
        strategy: new VisSense.VisMon.Strategy.AgainJsPollingStrategy({
          fullyvisible: 10
        }),
        update: function () {
          observer.callback();
        }
      });

      expect(observer.callback).not.toHaveBeenCalled();

      monitor.start();

      expect(observer.callback.calls.count()).toEqual(1);

      jasmine.clock().tick(999);

      expect(observer.callback.calls.count()).toEqual(100);

      monitor.stop();

      jasmine.clock().tick(999);
      jasmine.clock().tick(9999);
      jasmine.clock().tick(99999);

      expect(observer.callback.calls.count()).toEqual(100);

    });

    it('should verify switching modes when elements visibility changes', function () {
      var monitor = visobj.monitor({
        strategy: new VisSense.VisMon.Strategy.AgainJsPollingStrategy({
          fullyvisible: 1000,
          hidden: 10000
        }),
        update: function () {
          observer.callback();
        }
      });

      expect(observer.callback).not.toHaveBeenCalled();

      monitor.start();

      expect(observer.callback.calls.count()).toEqual(1);

      jasmine.clock().tick(1000);

      expect(observer.callback.calls.count()).toEqual(2);

      showHide(element, {
        hide: 1, // hide immediately
        show: 20001
      });
      jasmine.clock().tick(20002);

      expect(observer.callback.calls.count()).toEqual(4);

      monitor.stop();

      jasmine.clock().tick(999);
      jasmine.clock().tick(9999);
      jasmine.clock().tick(99999);

      expect(observer.callback.calls.count()).toEqual(4);

    });

  });
      /*


      function jumpToFixedPositionAndBack(element, leftInPixel, show, hide) {
        var formPosition = element.style.position;
        var formerLeft = element.style.left;
        var formerTop = element.style.top;
        setTimeout(function () {
          element.style.position = 'fixed';
          element.style.top = '0';
          element.style.left = leftInPixel + 'px';
          fireScrollEvent();
        }, show);

        setTimeout(function () {
          element.style.display = formPosition;
          element.style.left = formerLeft;
          element.style.top = formerTop;
          fireScrollEvent();
        }, hide);
      }


      describe('vissense-plugin-percentage-time-test.js async', function () {
        var visobj, observer;

        beforeEach(function () {
          jasmine.getFixtures().set('<div id="element" style="width: 1px; height: 1px;"></div>');
          visobj = new VisSense($('#element')[0]);

          observer = {callback: VisSense.Utils.noop};
          spyOn(observer, 'callback');

          jasmine.clock().install();

          jasmine.clock().mockDate();
        });

        afterEach(function () {
          jasmine.clock().uninstall();
        });

        it('should verify that default check interval is 100ms', function () {
          visobj.onPercentageTimeTestPassed(function () {
            observer.callback();
          }, {
            percentageLimit: 0.5,
            timeLimit: 1000
          });

          jasmine.clock().tick(999);
          expect(observer.callback).not.toHaveBeenCalled();

          jasmine.clock().tick(5000);
          expect(observer.callback.calls.count()).toEqual(1);

        });

        it('should check that the 50/1 test does NOT pass on hidden elements', function () {
          jasmine.getFixtures().set('<div id="element" style="display:none;"></div>');
          var visobj = new VisSense($('#element')[0]);

          visobj.on50_1TestPassed(function () {
            observer.callback();
          });

          jasmine.clock().tick(99999);
          expect(observer.callback).not.toHaveBeenCalled();
        });

        it('should check that the 50/1 test passes on visible elements', function () {
          visobj.on50_1TestPassed(function () {
            observer.callback();
          });

          jasmine.clock().tick(999);

          expect(observer.callback).not.toHaveBeenCalled();

          jasmine.clock().tick(3000);

          expect(observer.callback.calls.count()).toEqual(1);
        });

        it('should check that the 50/1 test does NOT pass when element becomes hidden before time limit has been reached', function () {
          jasmine.getFixtures().set('<div id="element" style="width: 10px; height: 10px; display:none;"></div>');
          var visobj = new VisSense($('#element')[0]);

          visobj.on50_1TestPassed(function () {
            observer.callback();
          });

          // show and hide the element in under a second
          showHide($('#element')[0], 1, 999);

          jasmine.clock().tick(200);
          expect(observer.callback).not.toHaveBeenCalled();

          // if we'd tick 1500 at once, than the callback would be triggered..
          jasmine.clock().tick(300);
          jasmine.clock().tick(300);
          jasmine.clock().tick(300);
          jasmine.clock().tick(300);

          expect(observer.callback).not.toHaveBeenCalled();
        });

        it('should check that the 50/1 test does NOT pass when elements visbility ' +
           'falls below percentage limit before time limit has been reached', function () {
          jasmine.getFixtures().set('<div id="element" style="width: 10px; height: 10px;"></div>');
          var visobj = new VisSense($('#element')[0]);

          visobj.on50_1TestPassed(function () {
            observer.callback();
          });

          jasmine.clock().tick(200);

          var leftInPixel = '-9';
          jumpToFixedPositionAndBack($('#element')[0], leftInPixel, 1, 999);

          jasmine.clock().tick(200);
          expect(observer.callback).not.toHaveBeenCalled();

          // if we'd tick 1500 at once, than the callback would be triggered..
          jasmine.clock().tick(300);
          jasmine.clock().tick(300);
          jasmine.clock().tick(300);
          jasmine.clock().tick(300);

          expect(observer.callback).not.toHaveBeenCalled();
        });

        it('should check that the 50/1 test does pass when element becomes hidden after limit has been reached', function () {
          jasmine.getFixtures().set('<div id="element" style="width: 10px; height: 10px; display:none;"></div>');
          var visobj = new VisSense($('#element')[0]);

          visobj.on50_1TestPassed(function () {
            observer.callback();
          });

          // show and hide the element in over a second
          showHide($('#element')[0], 1, 1010);
          jasmine.clock().tick(2); // shows the element

          jasmine.clock().tick(910);
          expect(observer.callback).not.toHaveBeenCalled();

          jasmine.clock().tick(10 + 1000); // VisSense default PollingStrategy interval is 1000ms

          expect(observer.callback.calls.count()).toEqual(1);

        });

      });*/

});
