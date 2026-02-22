export function deltaDecodeToSet(inputArray) {
    const resultSet = new Set();
    let last = 0;
    for (let delta of inputArray) {
        last += delta;
        resultSet.add(last);
    }
    return resultSet;
}

// Minifiers usually evaluate expressions with constants to move the evaluation to the assembly phase.
// In the case of left shift, this is often completely pointless and results in larger bundles.
export function leftShift(operand) {
    return 1 << operand;
}
