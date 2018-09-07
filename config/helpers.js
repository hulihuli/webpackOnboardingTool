var path = require('path');

var _root = path.resolve(__dirname, '..');

// this.logger.info("__dirname", __dirname);
// this.logger.info("_root", _root);
// __dirname D:\code\github\webpack\config
// _root D:\code\github\webpack

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  
  console.log(path.join.apply(path, [_root].concat(args)));
  // D:\code\myGit\webpack\src\tsconfig.json
  // D:\code\myGit\webpack\src\app
  // D:\code\myGit\webpack\src\app
  // D:\code\myGit\webpack\src
  // D:\code\myGit\webpack\dist


  return path.join.apply(path, [_root].concat(args));
}

exports.root = root;