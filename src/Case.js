export const CaseValues = Object.freeze([
    "именительный",
    "родительный",
    "дательный",
    "винительный",
    "творительный",
    "предложный",
    "местный"
]);

export const Case = Object.freeze({
    NOMINATIVE: CaseValues[0],
    GENITIVE: CaseValues[1],
    DATIVE: CaseValues[2],
    ACCUSATIVE: CaseValues[3],
    INSTRUMENTAL: CaseValues[4],
    PREPOSITIONAL: CaseValues[5],
    LOCATIVE: CaseValues[6]
});

export const CaseIndices = Object.fromEntries(CaseValues.map((x, i) => [x, i]));

export function toCaseIndex(grCase) {
    return (typeof grCase === "number") ? grCase : CaseIndices[grCase];
}
