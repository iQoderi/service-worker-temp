/**
 * Created by qoder on 16/12/18.
 */
"use strict";

var getCacheName = ()=> {
    return 'neuqstv-1';
}

var fetchAndCache = (request, evt)=> {
    fetch(request).then((response)=> {
        if (!response && !response.status !== 200) {
            return response;
        }
        var responseClone = response.clone();
        caches.open(getCacheName()).then((cache)=> {
            console.log(evt.request);
            cache.put(evt.request, responseClone);
        })

        return response;
    })
}

self.addEventListener('fetch', (evt)=> {
    let localUrl = /http:\/\/:localhost:3000/;
    let apiUrl = /http:\/\/api\.neuqst\.qoder\.cn/;
    let request = evt.request;
    let url = request.url;

    //处理index.html
    if (url.match(localUrl)) {
        console.log('called3123')
        //在线处理
        if (navigator.onLine) {
            return fetchAndCache(request, evt);
        } else {
            //断网处理
            evt.respondWith(
                caches.match(evt.request).then((response)=> {
                    if (response) {
                        return response;
                    }
                })
            )
        }
    }

    //处理api地址接口
    if (url.match(apiUrl)) {
        //断网情况
        if (!navigator.onLine) {
            evt.respondWith(
                caches.match(evt.request).then((response)=> {
                    return response;
                })
            )
        } else {
            //有网情况
            evt.respondWith(
                fetch(request).then((response)=> {
                    if (!response && response.status !== 200) {
                        return response;
                    }

                    var responseClone = response.clone();
                    caches.open(getCacheName()).then(function (cache) {
                        cache.put(evt.request, responseClone);
                    });
                    return response;
                })
            )
        }
    }

    if (!url.match(apiUrl) && !url.match(localUrl)) {
        console.log('静态资源')
        evt.respondWith(
            caches.match(evt.request).then((response)=> {
                if (response) {
                    return response;
                }
                var request = evt.request.clone();
                return fetch(request, (response)=> {
                    if (!response && response.status !== 200) {
                        return response;
                    }

                    var responseClone = response.clone();
                    caches.open(getCacheName()).then(function (cache) {
                        cache.put(evt.request, responseClone);
                    });
                    return response;
                });
            })
        )
    }
})
