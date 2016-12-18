/**
 * Created by qoder on 16/12/18.
 */
"use strict";
let cacheFiles = [
    './',
    './cache/about.js',
    './cache/blog.js'
]

self.addEventListener('install', (evt)=> {
    evt.waitUntil(
        caches.open('my-test-cache-v1').then((cache)=> {
            console.log(cache)
            return cache.addAll(cacheFiles)
        }).catch(()=> {
            console.log(1232)
        })
    )
})

self.addEventListener('fetch', (evt)=> {
    evt.respondWith(
        caches.match(evt.request).then((response)=> {
            if (response) {
                console.log(response)
                return response;
            }

            var request = evt.request.clone();
            return fetch(request).then((response)=> {
                console.log(response);
                if (!response && !response.status !== 200 && !response.headers.get('Content-type').match(/image/)) {
                    return response;
                }
                var responseClone = response.clone();
                caches.open('my-test-cache-v1').then((cache)=> {
                    cache.put(evt.request, responseClone);
                })

                return response;
            })

        })
    )
})
