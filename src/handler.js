import { fetchHomePageData } from './hath'
import { HttpError } from './helper'
import prom from './prometheus'

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
    const data = await fetchHomePageData(ipb.id, ipb.pass_hash)

    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

async function handleMetricsPrometheus(request) {
    const ipb = await getEhCookie(request)
    const data = await fetchHomePageData(ipb.id, ipb.pass_hash)

    let metrics = []
    for (const r of data.regions) {
        const labels = { region: r.name.toLowerCase() }
        metrics.push(
            prom.Gauge({
                name: 'hath_region_load',
                help: 'region load (MB/s)',
                val: r.load,
                labels: labels,
            }),
            prom.Gauge({
                name: 'hath_region_miss',
                help: 'region miss (%)',
                val: r.miss,
                labels: labels,
            }),
            prom.Gauge({
                name: 'hath_region_coverage',
                help: 'region coverage',
                val: r.coverage,
                labels: labels,
            }),
            prom.Gauge({
                name: 'hath_region_hits',
                help: 'region hits',
                val: r.hits,
                labels: labels,
            }),
            prom.Gauge({
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
            prom.Gauge({
                name: 'hath_client_status',
                help: 'client status 1 online, 0 offline',
                val: c.status === 'online' ? 1 : 0,
                labels: labels,
            }),
            prom.Gauge({
                name: 'hath_client_created',
                help: 'client created time (timestamp in ms)',
                val: new Date(c.created).getTime(),
                labels: labels,
            }),
            prom.Counter({
                name: 'hath_client_file_served_total',
                help: 'client total served file',
                val: c.file_served,
                labels: labels,
            }),
        )

        if (c.status === 'online') {
            prom.push(
                prom.Gauge({
                    name: 'hath_client_max_speed',
                    help: 'client max speed (KB/s)',
                    val: c.max_speed,
                    labels: labels,
                }),
                prom.Gauge({
                    name: 'hath_client_trust',
                    help: 'client trust',
                    val: c.trust,
                    labels: labels,
                }),
                prom.Gauge({
                    name: 'hath_client_quality',
                    help: 'client quality',
                    val: c.quality,
                    labels: labels,
                }),
                prom.Gauge({
                    name: 'hath_client_hit_rate',
                    help: 'client hit rate (min)',
                    val: c.hit_rate,
                    labels: labels,
                }),
                prom.Gauge({
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

export async function handleRequest(request) {
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
        if (e instanceof HttpError) {
            opt.status = e.code
            opt.statusText = e.message
        } else {
            console.log('handleRequest failed', e)
        }
        return new Response(null, opt)
    }
}
