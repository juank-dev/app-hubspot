const isAValidPhoneNumber = (number) => {
  return /^[\d\+\-\(\) ]+$/.test(number);
};

const isAuthorized = (userId) => {
  return refreshTokenStore[userId] ? true : false;
};

module.exports = {
  isAValidPhoneNumber,
};
