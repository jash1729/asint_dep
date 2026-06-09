using { asint.db } from '../db/schema';

service AssetService {
    entity Assets as projection on db.Assets;
}