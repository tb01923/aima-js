
const zip = (a, b) => {
    return a.map(function(e, i) {
        return [e, b[i]];
    });
}

module.exports = { zip }