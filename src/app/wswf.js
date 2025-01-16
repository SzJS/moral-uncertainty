export function printOrder(actions) {
    // TODO: incorrect: doesn't consider the possibility of equality!
    let result = '';
    for (let i = 0; i < actions.length; i++) {
      result += actions[i];
      if (i !== actions.length -1) {
        result += ' < ';
      }
    }
    return result;
}

export function ec(T, a, c) {
    let sum = 0;
    let credence;
    let choiceWorthiness;
    for (const t of T) {
        credence = c.get(t);
        choiceWorthiness = t.get(a);
        sum += credence * choiceWorthiness;
    }
    return sum;
}
  
export function mec(T, A, c) {
    const result = [];
    let expectedChoiceworthiness;
    for (const a of A) {
        expectedChoiceworthiness = ec(T, a, c);
        result.push([a, expectedChoiceworthiness]);
    }
    result.sort((a, b) => a[1] - b[1]);
    return result.map(([actionA, ecA]) => actionA);
}
  
export function min(T, a, c) {
    let result = Number.POSITIVE_INFINITY;
    let choiceWorthiness;
    for (const t of T) {
        choiceWorthiness = t.get(a);
        if (choiceWorthiness < result) {
            result = choiceWorthiness;
        }
    }
    return result;
}
  
export function maximin(T, A, c) {
    const result = [];
    let minChoiceworthiness;
    for (const a of A) {
        minChoiceworthiness = min(T, a, c);
        result.push([a, minChoiceworthiness]);
    }
    result.sort(([actionA, mA], [actionB, mB]) => mA - mB);
    return result.map(([actionA, mA]) => actionA);
}

export function median(T, a, c) {
    const sortedPairs = [];
    const medians = [];
    let choiceWorthiness;
    for (const t of T) {
        choiceWorthiness = t.get(a);
        sortedPairs.push([t, choiceWorthiness]);
    }

    sortedPairs.sort(([theoryT, cwT], [theoryT_, cwT_]) => cwT - cwT_);

    for (let i = 0; i < sortedPairs.length; i++) {
        const [theoryT, cwT] = sortedPairs[i];
        let credenceLess = 0;
        let credenceMore = 0;

        for (let j = 0; j < i; j++) {
            const [theoryT_, cwT_] = sortedPairs[j];
            credenceLess += c.get(theoryT_);
        }

        for (let j = i + 1; j < sortedPairs.length; j++) {
            const [theoryT_, cwT_] = sortedPairs[j];
            credenceMore += c.get(theoryT_);
        }

        if (credenceLess <= 0.5 && credenceMore <= 0.5) {
            medians.push(cwT);
        }
    }
    if (medians.length === 1) {
        return medians[0];
    } else {
        return (medians[0] + medians[1]) / 2;
    }
}

export function hm(T, A, c) {
    const result = [];
    let medianChoiceworthiness;
    for (const a of A) {
        medianChoiceworthiness = median(T, a, c);
        result.push([a, medianChoiceworthiness]);
    }
    result.sort(([actionA, mA], [actionB, mB]) => mA - mB);
    return result.map(([actionA, mA]) => actionA);
}