'use client'

import { printOrder, mec, maximin, hm, indifference, vetoing } from './wswf.js';
import { useState } from 'react';

export default function Home() {

  const T = new Set();
  const A = new Set();
  const c = new Map();

  const left = "l";
  const middle = "m";
  const right = "r";

  A.add(left);
  A.add(middle);
  A.add(right);

  const theoryD = new Map();
  theoryD.set(left, -20);
  theoryD.set(middle, -10);
  theoryD.set(right, -5);

  const theoryU = new Map();
  theoryU.set(left, -1);
  theoryU.set(middle, -2);
  theoryU.set(right, -4);

  T.add(theoryD);
  T.add(theoryU);

  c.set(theoryD, 0.1);
  c.set(theoryU, 0.9);

  const [k, setK] = useState(0.05);

  function handleKChange(e) {
    setK(e.target.value);
  }

  // TODO: let T, c also be part of the state

  const mecList = mec(T, A, c).map(([ actionA, ecA ]) => {
    return <li key={actionA}>ec({actionA}) = {ecA}</li>
  });

  const vetoedMecList = vetoing(T, A, c, k, mec).map(([ actionA, ecA ]) => {
    if (ecA !== Number.NEGATIVE_INFINITY) {
      return <li key={actionA}>ec({actionA}) = {ecA}</li>
    } else {
      return <li key={actionA}>{actionA} is vetoed</li>
    }
  });

  const maximinList = maximin(T, A, c).map(([ actionA, mA ]) => {
    return <li key={actionA}>min({actionA}) = {mA}</li>
  });

  const hmList = hm(T, A, c).map(([ actionA, mA ]) => {
    return <li key={actionA}>hm({actionA}) = {mA}</li>
  });


  return (
    <>
      <input
        placeholder="k"
        value={k}
        onChange={handleKChange}
      />
      <div>
        <ul>{mecList}</ul>
        <div>MEC orders the actions: {printOrder(mec(T, A, c))}</div>
        <div>{k}-indifference-fortified MEC orders the actions: {printOrder(indifference(T, A, c, k, mec))}</div>
        <ul>{vetoedMecList}</ul>
        <div>{k}-vetoing-fortified MEC orders the actions: {printOrder(vetoing(T, A, c, k, mec))}</div>
      </div>
      <div>
        <ul>{maximinList}</ul>
        Maximin orders the actions: {printOrder(maximin(T, A, c))}
      </div>
      <div>
        <ul>{hmList}</ul>
          HM orders the actions: {printOrder(hm(T, A, c))}
      </div>
    </>
  );
}
