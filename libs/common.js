function addHTML (str) {
  return str.replace(/^/gm, '<p>').replace(/$/gm, '</p>')
}
function formatTime (time) {
}

module.exports = {
  addHTML,
  formatTime
}