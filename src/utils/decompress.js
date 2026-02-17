export function deltaDecodeToSet(inputArray) {
    const resultSet = new Set();
    let last = 0;
    for (let delta of inputArray) {
        last += delta;
        resultSet.add(last);
    }
    return resultSet;
}
