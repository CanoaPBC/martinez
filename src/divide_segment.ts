import SweepEvent        from './sweep_event';
import compareEvents     from './compare_events';
import { Point, equals } from './types';
import Queue             from 'tinyqueue';

export default function divideSegment(
  se:SweepEvent, p:Point, queue:Queue<SweepEvent>
):Queue<SweepEvent>  {
  const r = new SweepEvent(p, false, se,            se.isSubject);
  const l = new SweepEvent(p, true,  se.otherEvent, se.isSubject);

  /* eslint-disable no-console */
  if (equals(se.point, se.otherEvent.point)) {
    console.warn('what is that, a collapsed segment?', se);
  }
  /* eslint-enable no-console */

  r.contourId = l.contourId = se.contourId;

  // avoid a rounding error. The left event would be processed after the right event
  if (compareEvents(l, se.otherEvent) > 0) {
    se.otherEvent.left = true;
    l.left = false;
  }

  // avoid a rounding error. The left event would be processed after the right event
  // if (compareEvents(se, r) > 0) {}

  se.otherEvent.otherEvent = l;
  se.otherEvent = r;

  queue.push(l);
  queue.push(r);

  return queue;
}