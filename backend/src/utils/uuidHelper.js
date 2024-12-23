const { v4: uuidv4 } = require('uuid');

/**
 * Generates a random UUID v4.
 * @returns {string} The generated UUID.
 */
function generateUUID() {
  return uuidv4();
}

/**
 * Validates if the given string is a valid UUID v4.
 * @param {string} uuid The UUID string to validate.
 * @returns {boolean} Returns true if the UUID is valid, otherwise false.
 */
function validateUUID(uuid) {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(uuid);
}

module.exports = {
  generateUUID,
  validateUUID,
};
