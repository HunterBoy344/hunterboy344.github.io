let cache_name = "user-cache";
let filesToCache = [
    "/",
    "/manifest.json",
    "/icon.png",
];
caches.open("pwa-assets")
.then(cache => {
  cache.addAll(filesToCache)
});

self.addEventListener("install", (event) => {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();

  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
});

addEventListener("message", (event) => {
  // event is an ExtendableMessageEvent object
  if (event.data instanceof File) {
    let response = new Response(event.data)
    caches.open(cache_name).then((cache) => {
      cache
        .put(event.data.name,response)
        .then(() => console.log("Data added to cache."))
        .catch((error) => console.error("Error adding data to cache:", error));
    });
  } else {
    console.log(`The client sent me a message: ${event.data}`);
    event.source.postMessage("Hi client");
  }
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request);
      }
    }),
  );
});