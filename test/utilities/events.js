// Dependencies
import { expect } from 'chai';
import Events from '../../lib/utilities/events';

// Main event listeners
class Hive {
  constructor(location) {
    this.location = location;
  }
}

// Create an example event
class InvasionEvent {
  constructor(attackers) {
    this.attackers = attackers;
  }
}

class AnotherInvasionEvent extends InvasionEvent {
  constructor(attackers) {
    super(attackers);
  }
}

describe('Events', function () {
  var hive;
  var hiveEvent;

  beforeEach(function () {
    hive = new Hive("Portland");
    hiveEvent = new InvasionEvent(["Fire", "Earth", "Water", "Air"]);
    Events(Hive);
  });

  it('should add events methods to a listener', function() {
    expect(hive.emit).to.be.a("Function");
    expect(hive.on).to.be.a("Function");
    expect(hive.off).to.be.a("Function");
  });

  it('should bind an event listener correctly', function () {
    hive.on(InvasionEvent, (e) => {
      expect(hive._listenersForEvent(InvasionEvent).length).to.equal(1);
    });
  });

  it('should remove all listeners if one isnt provided', function () {
    let listenerOne = (e) => { return 1; };
    let listenerTwo = (e) => { return 2; };

    hive.on(InvasionEvent, listenerOne);
    hive.on(InvasionEvent, listenerTwo);

    expect(hive._listenersForEvent(InvasionEvent).length).to.equal(2);
    hive.off(InvasionEvent);
    expect(hive._listenersForEvent(InvasionEvent).length).to.equal(0);
  });

  it('should remove a single listener', function () {
    let listenerOne = (e) => { return 1; };
    let listenerTwo = (e) => { return 2; };

    hive.on(InvasionEvent, listenerOne);
    hive.on(InvasionEvent, listenerTwo);
    expect(hive._listenersForEvent(InvasionEvent).length).to.equal(2);

    hive.off(InvasionEvent, listenerOne);
    expect(hive._listenersForEvent(InvasionEvent).length).to.equal(1);

    hive.off(InvasionEvent, listenerTwo);
    expect(hive._listenersForEvent(InvasionEvent).length).to.equal(0);
  });

  it('should not fail when trying to remove unregistered listeners', function () {
    let listenerOne = (e) => { return 1; };
    expect((_) => hive.off(InvasionEvent, listenerOne)).to.not.throw(Error);
    expect((_) => hive.off(InvasionEvent)).to.not.throw(Error);
  });

  it('should emit correct events', function (done) {
    let eventOne = new InvasionEvent("Rebels");
    let eventTwo = new AnotherInvasionEvent("Politicians");

    let listenerOne = (e) => { expect(e.attackers).to.equal("Rebels"); };
    let listenerTwo = (e) => { expect(e.attackers).to.equal("Politicians"); done(); };

    hive.on(InvasionEvent, listenerOne);
    hive.on(AnotherInvasionEvent, listenerTwo);

    hive.emit(eventOne);
    hive.emit(eventTwo);
  });
});
