/**
 * Will generate a random string
 * @returns {string}
 */
function RandomString() {
    return (Math.random() + 1).toString(36).substring(2);
}

module.exports = {
    RandomString: RandomString
}