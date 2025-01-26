export function printOrder(actionECPairs) {
    let result = '';
    let action, evaluation;
    let nextEvaluation;
    for (let i = 0; i < actionECPairs.length; i++) {
        [action, evaluation] = actionECPairs[i];
        result += action;
        if (i !== actionECPairs.length -1) {
            nextEvaluation = actionECPairs[i+1][1];
            if (evaluation !== nextEvaluation) {
                result += ' < ';
            } else {
                result += ' = ';
            }
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
    return result;
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
    return result;
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
    return result;
}

export function indifference(T, A, c, k, f) {
    let leftover = 0;
    const T_ = new Set(T);
    const c_ = new Map(c);
    for (const t of T) {
        if (c.get(t) <= k) {
            leftover += c.get(t);
            T_.delete(t);
            c_.delete(t);
        }
    }

    if (T_.size === 0) {
        // if T' is empty, it's because no theories have more than k credence
        // in such situations T' contains theories with maximal credence

        let max = Number.NEGATIVE_INFINITY;

        for (const t of T) {
            if (c.get(t) > max) {
                max = c.get(t);
            }
        }

        leftover = 0; // we have to recalculate the credence to redistribute

        for (const t of T) {
            if (c.get(t) === max) {
                T_.add(t);
                console.log("Added theory " + t);
            } else {
                leftover += c.get(t);
            }
        }
    }

    const normaliser = leftover / T_.size;
    for (const t of T_) {
        c_.set(t, c.get(t) + normaliser);
    }
    return f(T_, A, c_);
}

export function vetoing(T, A, c, k, f) {
    const result_ik = indifference(T, A, c, k, f);
    const [worstAction, worstEval] = result_ik[0];
    let currentAction, currentEval;
    const vetoed = new Set(worstAction);
    for (let i = 1; i < result_ik.length; i++) {
        [currentAction, currentEval] = result_ik[i];
        if (currentEval === worstEval) {
            vetoed.add(currentAction);
        } else {
            break;
        }
    }

    const result_f = f(T, A, c);

    const result_v = [];

    for (const action of vetoed) {
        result_v.push([action, Number.NEGATIVE_INFINITY]);
    }

    for (let i = 0; i < result_f.length; i++) {
        [currentAction, currentEval] = result_f[i];
        if (!vetoed.has(currentAction)) {
            result_v.push([currentAction, currentEval]);
        }
    }

    return result_v;

}