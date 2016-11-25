self.addEventListener('install', event => {
  // Do install stuff
  console.log('install SW')
});

self.addEventListener('activate', event => {
  // Do activate stuff: This will come later on.
  console.log('activate SW')

});