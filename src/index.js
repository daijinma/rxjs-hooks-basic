import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useEventCallback } from "rxjs-hooks";
import { map, switchMap, takeUntil, withLatestFrom } from "rxjs/operators";

import "./styles.css";
import { fromEvent } from "rxjs";

function App() {
  const [onDrage, [x, y]] = useEventCallback(
    (event$, state$) =>
      event$.pipe(
        withLatestFrom(state$),
        map(([e, prevPos]) => [e.clientX, e.clientY, prevPos]),
        switchMap(([x, y, prevPos]) => {
          return fromEvent(window, "mousemove")
            .pipe(
              map(e => [e.clientX - x + prevPos[0], e.clientY - y + prevPos[1]])
            )
            .pipe(
              map(([x, y]) => [x < 10 ? 0 : x, y]),
              map(([x, y]) => [x, y < 10 ? 0 : y])
            )
            .pipe(takeUntil(fromEvent(window, "mouseup")));
        })
      ),
    [0, 0]
  );

  return (
    <div>
      {x} --
      {y}
      <div
        className="box"
        onMouseDown={onDrage}
        style={{
          left: x,
          top: y
        }}
      >
        drage me
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
