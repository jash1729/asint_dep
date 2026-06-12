// Minimal CAP project source so that `cds build --for java-cf` against
// ./asint_ais_event_layer (as configured in .cdsrc.json) succeeds. Re-exposes
// the Asset entity under an event-layer scoped service.

using { asint.db as db } from '../../db/schema';

@path: '/event_layer'
service EventLayerService {
    entity Assets as projection on db.Assets;
}
