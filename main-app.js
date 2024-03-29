function isAvailable(value = "") {
    if (typeof value === "string" && value.length === 0) return false;
    else if (value === null) return false;
    else return true;
}