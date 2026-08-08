global.window = global;
require('./app/src/main/assets/www/js/sha256.js');
const crypto = require('crypto');
const cases = [
  '',
  'abc',
  'abcdbcdecdefdefghfghighijhijkijkljklmklmnlmnomnopnopq',
  'The quick brown fox jumps over the lazy dog',
  '事现鉴共创论',
  'a'.repeat(1000),
  '南京博物院文物事件|common|2026-07-30'
];
let ok = true;
for (const c of cases) {
  const got = global.sha256Hex(c);
  const exp = crypto.createHash('sha256').update(c, 'utf8').digest('hex');
  const pass = got === exp;
  if (!pass) ok = false;
  console.log((pass ? 'PASS' : 'FAIL') + ' len=' + c.length + ' => ' + got + (pass ? '' : ('  EXPECT=' + exp)));
}
console.log(ok ? 'ALL PASS' : 'SOME FAIL');
