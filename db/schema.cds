namespace asint.db;

using { cuid } from '@sap/cds/common';

entity Assets : cuid {
    name : String(100);
    type : String(50);
    status : String(30);
}