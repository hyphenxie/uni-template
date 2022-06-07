const fs = require('fs-extra')
module.exports = function (pkgPath) {
    let pkg = fs.readFileSync(pkgPath)
    pkg = JSON.parse(pkg)
    return pkg.version
}
