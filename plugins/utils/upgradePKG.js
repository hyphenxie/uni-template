const fs = require('fs')
const getPkgVer = require('./getPkgVer')
module.exports = function (pkgPath, ver = 'c') {
    let pkg = fs.readFileSync(pkgPath);
    pkg = JSON.parse(pkg);
    const [a,b,c] = pkg.version.split('.')
    console.log(`更新前的版本：${pkg.version}`)
    if (ver === 'c') {
        pkg.version = `${a}.${b}.${Number(c) + 1}`
    }
    if (ver === 'b') {
        pkg.version = `${a}.${b - 0 + 1}.0`
    }
    if (ver === 'a') {
        pkg.version = `${a - 0 + 1}.0.0`
    }
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log(`更新后的版本：${getPkgVer(pkgPath)}`)
}