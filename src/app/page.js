import { printOrder, ec, mec, min, maximin, median, hm } from './wswf.js';

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

  const mecList = mec(T, A, c).map(([ actionA, ecA ]) => {
    return <li>ec({actionA}) = {ec(T, actionA, c)}</li>
  });

  const maximinList = maximin(T, A, c).map(([ actionA, mA ]) => {
    return <li>min({actionA}) = {min(T, actionA, c)}</li>
  });

  const hmList = hm(T, A, c).map(([ actionA, mA ]) => {
    return <li>hm({actionA}) = {median(T, actionA, c)}</li>
  });


  return (
    <>
      <div>
        <ul>{mecList}</ul>
        MEC orders the actions: {printOrder(mec(T, A, c))}
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
