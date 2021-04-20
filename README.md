# Hath metrics
Hentai@Home metrics with prometheus and cloudflare workers.

## Usage
1. Copy dist/worker.js to cloudflare worker.
2. Find `ipb_member_id` and `ipb_pass_hash` from your e-hentai cookie, then set up worker environment variables `IPB_MEMBER_ID` and `IPB_PASS_HASH`.
3. Configure a new job of prometheus  
```yaml
 - job_name: 'hath-worker'
   scrape_interval: 30m
   scheme: https
   static_configs:
   - targets: ['your.worker.workers.dev:443']
```

## Available Metrics

| Name                          | Type    | labels          |
|-------------------------------|---------|-----------------|
| hath_region_load              | Gauge   | region          |
| hath_region_miss              | Gauge   | region          |
| hath_region_coverage          | Gauge   | region          |
| hath_region_hits              | Gauge   | region          |
| hath_region_quality           | Gauge   | region          |
| hath_client_status            | Gauge   | name,id,country |
| hath_client_created           | Gauge   | name,id,country |
| hath_client_file_served_total | Counter | name,id,country |
| hath_client_max_speed         | Gauge   | name,id,country |
| hath_client_trust             | Gauge   | name,id,country |
| hath_client_quality           | Gauge   | name,id,country |
| hath_client_hit_rate          | Gauge   | name,id,country |
| hath_client_hath_rate         | Gauge   | name,id,country |

# License
[Apache 2.0](LICENSE)
