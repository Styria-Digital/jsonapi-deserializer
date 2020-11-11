"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = void 0;
var assign_1 = __importDefault(require("lodash/assign"));
var isArray_1 = __importDefault(require("lodash/isArray"));
var mapValues_1 = __importDefault(require("lodash/mapValues"));
var merge_1 = __importDefault(require("lodash/merge"));
function deserialize(doc) {
    return denormalize(doc.data, createRelationshipsHash(doc));
}
exports.deserialize = deserialize;
function createRelationshipsHash(doc) {
    var result = {};
    if (doc.included) {
        doc.included.forEach(function (resource) {
            var _a, _b;
            var id = resource.id, type = resource.type;
            merge_1.default(result, (_a = {}, _a[type] = (_b = {}, _b[id] = resource, _b), _a));
        });
    }
    return result;
}
function denormalize(resources, relations) {
    return fmapMultiple(resources, function (resource) {
        return processResource(resource, relations);
    });
}
function processResource(res, relHash) {
    var id = res.id, attributes = res.attributes, relationships = res.relationships;
    var rels = mapValues_1.default(relationships, function (rel) {
        return fmapMultiple(rel.data, function (relId) {
            var relRes = findRelation(relId, relHash);
            return relRes && processResource(relRes, relHash);
        });
    });
    return assign_1.default({}, attributes, { id: id }, rels);
}
function findRelation(rel, relations) {
    return relations[rel.type] && relations[rel.type][rel.id];
}
// Helper functions
function fmapMultiple(data, transform) {
    // Null Case
    if (!data) {
        return undefined;
        // Array Case
    }
    else if (isArray_1.default(data)) {
        return data.map(transform);
        // Single Case
    }
    else {
        return transform(data);
    }
}
//# sourceMappingURL=index.js.map