// Minimal CAP project source so that `cds build --for java-cf` against
// ./asint_ais_backend (as configured in .cdsrc.json) produces a valid
// model. The actual service projection lives in asint_ais_model/service.cds;
// re-exposing the entity here under a backend-scoped service satisfies CAP's
// "the src must contain at least one service definition" requirement.

using { asint.db as db } from '../../db/schema';

@path: '/backend'
service BackendService {
    entity Assets as projection on db.Assets;
}
