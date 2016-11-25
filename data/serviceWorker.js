'use strict';

self.addEventListener('install', event => {
	console.log('install sw')
  // function onInstall () {
  //   return caches.open('static')
  //     .then(cache =>
  //       cache.addAll([
  //         '/images/lyza.gif'
  //       ])
  //     );
  // }

  // event.waitUntil(onInstall(event));
});

self.addEventListener('activate', event => {
	console.log('activate sw')
});

self.addEventListener('push', function(event){
	console.log('push', event)
	// new Notification('qwe',{body:"qwe", tag: "asd"})
})