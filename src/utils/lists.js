export function unique(a) {
    return a.filter((item, index) => a.indexOf(item) === index);
}
