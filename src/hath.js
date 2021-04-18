import { HttpError } from './helper'

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

export async function fetchHomePageData(ipb_member_id, ipb_pass_hash) {
    const resp = await fetch('https://e-hentai.org/hentaiathome.php', {
        headers: {
            Cookie: `ipb_member_id=${ipb_member_id}; ipb_pass_hash=${ipb_pass_hash};`,
        },
        redirect: 'manual',
    })

    if (resp.status >= 400) {
        throw new HttpError(resp.status, resp.statusText)
    } else if (resp.status === 302) {
        //login page
        throw new HttpError(401, 'login failed')
    }

    const regionsCtx = new TableContext(0)
    const clientsCtx = new TableContext(0)
    await new HTMLRewriter()
        .on('table', regionsCtx)
        .on('table>tr', new TrHandler(regionsCtx))
        .on('table>tr>td', new TdHandler(regionsCtx))
        .on('table.hct', clientsCtx)
        .on('table.hct>tr', new TrHandler(clientsCtx))
        .on('table.hct>tr>td', new TdHandler(clientsCtx))
        .transform(resp)
        .text()

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
            ip: tr[6],
            port: +tr[7],
            versin: tr[8],
            max_speed: +tr[9].replace(' KB/s', ''),
            trust: +tr[10],
            quality: +tr[11],
            hit_rate: +tr[12].replace(' / min', ''),
            hath_rate: +tr[13].replace(' / day', ''),
            country: tr[14],
        }
        clients.push(client)
    }

    return { regions, clients, text }
}
