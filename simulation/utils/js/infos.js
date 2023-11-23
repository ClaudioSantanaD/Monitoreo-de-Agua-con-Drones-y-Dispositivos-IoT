const {execSync} = require('child_process');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question('getid\n', id => {
  while(true) {
    console.log('print My ID');
    execSync('sleep 1')
    console.log(`print ${id}`);
    execSync('sleep 1')
  }
  readline.close();
})