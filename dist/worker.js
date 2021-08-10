(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/handler.js":
/*!************************!*\
  !*** ./src/handler.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "handleRequest": () => (/* binding */ handleRequest)
/* harmony export */ });
/* harmony import */ var _hath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hath */ "./src/hath.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helper */ "./src/helper.js");
/* harmony import */ var _prometheus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./prometheus */ "./src/prometheus.js");




async function getEhCookie(request) {
    const headers = request.headers
    const ipb = {
        id: headers.get('ipb_id') || globalThis.IPB_MEMBER_ID,
        pass_hash: headers.get('ipb_pass_hash') || globalThis.IPB_PASS_HASH,
    }
    return ipb
}

async function handleMetricsJson(request) {
    const ipb = await getEhCookie(request)
    const data = await (0,_hath__WEBPACK_IMPORTED_MODULE_0__.fetchHomePageData)(ipb.id, ipb.pass_hash)

    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

async function handleMetricsPrometheus(request) {
    const ipb = await getEhCookie(request)
    const data = await (0,_hath__WEBPACK_IMPORTED_MODULE_0__.fetchHomePageData)(ipb.id, ipb.pass_hash)

    let metrics = []
    for (const r of data.regions) {
        const labels = { region: r.name.toLowerCase() }
        metrics.push(
            _prometheus__WEBPACK_IMPORTED_MODULE_2__.default.Gauge({
                name: 'hath_region_load',
                help: 'region load (MB/s)',
                val: r.load,
                labels: labels,
            }),
            _prometheus__WEBPACK_IMPORTED_MODULE_2__.default.Gauge({
                name: 'hath_region_miss',
                help: 'region miss (%)',
                val: r.miss,
                labels: labels,
            }),
            _prometheus__WEBPACK_IMPORTED_MODULE_2__.default.Gauge({
                name: 'hath_region_coverage',
                help: 'region coverage',
                val: r.coverage,
                labels: labels,
            }),
            _prometheus__WEBPACK_IMPORTED_MODULE_2__.default.Gauge({
                name: 'hath_region_hits',
                help: 'region hits',
                val: r.hits,
                labels: labels,
            }),
            _prometheus__WEBPACK_IMPORTED_MODULE_2__.default.Gauge({
                name: 'hath_region_quality',
                help: 'region quality',
                val: r.quality,
                labels: labels,
            }),
        )
    }

    for (const c of data.clients) {
        const labels = {
            name: c.name,
            id: c.id,
            country: c.country,
        }
        metrics.push(
            _prometheus__WEBPACK_IMPORTED_MODULE_2__.default.Gauge({
                name: 'hath_client_status',
                help: 'client status 1 online, 0 offline',
                val: c.status === 'online' ? 1 : 0,
                labels: labels,
            }),
            _prometheus__WEBPACK_IMPORTED_MODULE_2__.default.Gauge({
                name: 'hath_client_created',
                help: 'client created time (timestamp in ms)',
                val: new Date(c.created).getTime(),
                labels: labels,
            }),
            _prometheus__WEBPACK_IMPORTED_MODULE_2__.default.Counter({
                name: 'hath_client_file_served_total',
                help: 'client total served file',
                val: c.file_served,
                labels: labels,
            }),
        )

        if (c.status === 'online') {
            _prometheus__WEBPACK_IMPORTED_MODULE_2__.default.push(
                _prometheus__WEBPACK_IMPORTED_MODULE_2__.default.Gauge({
                    name: 'hath_client_max_speed',
                    help: 'client max speed (KB/s)',
                    val: c.max_speed,
                    labels: labels,
                }),
                _prometheus__WEBPACK_IMPORTED_MODULE_2__.default.Gauge({
                    name: 'hath_client_trust',
                    help: 'client trust',
                    val: c.trust,
                    labels: labels,
                }),
                _prometheus__WEBPACK_IMPORTED_MODULE_2__.default.Gauge({
                    name: 'hath_client_quality',
                    help: 'client quality',
                    val: c.quality,
                    labels: labels,
                }),
                _prometheus__WEBPACK_IMPORTED_MODULE_2__.default.Gauge({
                    name: 'hath_client_hit_rate',
                    help: 'client hit rate (min)',
                    val: c.hit_rate,
                    labels: labels,
                }),
                _prometheus__WEBPACK_IMPORTED_MODULE_2__.default.Gauge({
                    name: 'hath_client_hath_rate',
                    help: 'client hath rate (day)',
                    val: c.hath_rate,
                    labels: labels,
                }),
            )
        }
    }

    return new Response(metrics.join('\n'), {
        headers: {
            'Content-Type': 'text/plain; version=0.0.4',
        },
    })
}

async function handleRequest(request) {
    try {
        const pathname = new URL(request.url).pathname.toLowerCase()

        if (pathname === '/metrics') {
            return handleMetricsPrometheus(request)
        }
        if (pathname === '/metrics-raw') {
            return handleMetricsJson(request)
        }

        return new Response('not found', { status: 404 })
    } catch (e) {
        let opt = {
            status: 500,
        }
        if (e instanceof _helper__WEBPACK_IMPORTED_MODULE_1__.HttpError) {
            opt.status = e.code
            opt.statusText = e.message
        } else {
            console.log('handleRequest failed', e)
        }
        return new Response(null, opt)
    }
}


/***/ }),

/***/ "./src/hath.js":
/*!*********************!*\
  !*** ./src/hath.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchHomePageData": () => (/* binding */ fetchHomePageData)
/* harmony export */ });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./src/helper.js");


class TableContext {
    constructor(index) {
        this.tableIndex = index
        this.tableCount = 0
        this.tr = []
    }

    _checkTable() {
        return this.tableIndex === this.tableCount - 1
    }

    element(el) {
        if (el.tagName === 'table') {
            this.tableCount++
        }
    }

    newTr() {
        if (!this._checkTable()) {
            return
        }
        this.tr.push([])
    }

    newTd() {
        if (!this._checkTable()) {
            return
        }
        this.tr[this.tr.length - 1].push('')
    }

    appendTdText(text) {
        if (!this._checkTable()) {
            return
        }
        const tr = this.tr[this.tr.length - 1]
        const i = tr.length - 1
        tr[i] += text
    }
}

class TrHandler {
    constructor(ctx) {
        this.ctx = ctx
    }

    element(el) {
        this.ctx.newTr()
    }
}

class TdHandler {
    constructor(ctx) {
        this.ctx = ctx
    }

    element(el) {
        this.ctx.newTd()
    }

    text(t) {
        this.ctx.appendTdText(t.text)
    }
}

async function fetchHomePageData(ipb_member_id, ipb_pass_hash) {
    const resp = await fetch('https://e-hentai.org/hentaiathome.php', {
        headers: {
            Cookie: `ipb_member_id=${ipb_member_id}; ipb_pass_hash=${ipb_pass_hash};`,
        },
        redirect: 'manual',
    })

    if (resp.status >= 400) {
        throw new _helper__WEBPACK_IMPORTED_MODULE_0__.HttpError(resp.status, resp.statusText)
    } else if (resp.status === 302) {
        //login page
        throw new _helper__WEBPACK_IMPORTED_MODULE_0__.HttpError(401, 'login failed')
    }

    const regionsCtx = new TableContext(0)
    const clientsCtx = new TableContext(0)
    const text = await new HTMLRewriter()
        .on('table', regionsCtx)
        .on('table>tr', new TrHandler(regionsCtx))
        .on('table>tr>td', new TdHandler(regionsCtx))
        .on('table.hct', clientsCtx)
        .on('table.hct>tr', new TrHandler(clientsCtx))
        .on('table.hct>tr>td', new TdHandler(clientsCtx))
        .transform(resp)
        .text()

    if (text.includes('Your IP address has been temporarily')) {
        throw new _helper__WEBPACK_IMPORTED_MODULE_0__.HttpError(403, text)
    }

    let regions = []
    regionsCtx.tr.shift()
    for (const tr of regionsCtx.tr) {
        const region = {
            name: tr[0],
            load: +tr[3].replace(' MB/s', ''),
            miss: +tr[4].replace(' %', ''),
            coverage: +tr[5],
            hits: +tr[6],
            quality: +tr[7],
        }
        regions.push(region)
    }

    let clients = []
    clientsCtx.tr.shift()
    for (const tr of clientsCtx.tr) {
        const client = {
            name: tr[0],
            id: +tr[1],
            status: tr[2].toLowerCase(),
            created: tr[3],
            last_seen: tr[4],
            file_served: +tr[5].replace(',', ''),
            
        }

        if (client.status === 'online') {
            client.ip = tr[6]
            client.port = +tr[7]
            client.versin = tr[8]
            client.max_speed = +tr[9].replace(' KB/s', '')
            client.trust = +tr[10]
            client.quality = +tr[11]
            client.hit_rate = +tr[12].replace(' / min', '')
            client.hath_rate = +tr[13].replace(' / day', '')
            client.country = tr[14]
        }

        clients.push(client)
    }

    return { regions, clients }
}


/***/ }),

/***/ "./src/helper.js":
/*!***********************!*\
  !*** ./src/helper.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HttpError": () => (/* binding */ HttpError)
/* harmony export */ });
class HttpError extends Error {
    constructor(code, ...args) {
        super(...args)
        this.code = code
        Error.captureStackTrace(this, HttpError)
    }
}


/***/ }),

/***/ "./src/prometheus.js":
/*!***************************!*\
  !*** ./src/prometheus.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// https://github.com/prometheus/docs/blob/master/content/docs/instrumenting/exposition_formats.md

function formatMetric(type, { name, help, val, labels }) {
    const fmt = `# HELP ${name} ${help}
# TYPE ${name} ${type}
${name}${formatLabels(labels)} ${resolveValue(val)}`
    return fmt
}

function formatLabels(labels) {
    if (!labels) {
        return ''
    }

    const entires = Object.entries(labels)
    if (entires.length === 0) {
        return ''
    }

    let s = ''
    for (const [k, v] of entires) {
        s += `${k}="${String(v).replace(/(["\n\\])/g, '\\$1')}",`
    }
    return `{${s}}`
}

function resolveValue(value) {
    if (Number.isNaN(value)) {
        return 'Nan'
    } else if (!Number.isFinite(value)) {
        if (value < 0) {
            return '-Inf'
        } else {
            return '+Inf'
        }
    } else {
        return `${value}`
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    Counter: (...args) => formatMetric('counter', ...args),
    Gauge: (...args) => formatMetric('gauge', ...args),
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./handler */ "./src/handler.js");


addEventListener('fetch', (event) => {
    event.respondWith((0,_handler__WEBPACK_IMPORTED_MODULE_0__.handleRequest)(event.request))
})

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=worker.js.map