// helpers.js


//  Formats a date in "DD/MM/YYYY" format
function formatDate(date) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString('en-GB', options);
  }


  module.exports = {
    formatDate
  };
  