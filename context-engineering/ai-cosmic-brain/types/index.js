"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeType = exports.MissionStatus = exports.MissionCategory = exports.MissionPriority = exports.PredictionStatus = exports.ImpactLevel = exports.PatternCategory = void 0;
var PatternCategory;
(function (PatternCategory) {
    PatternCategory["ARCHITECTURE"] = "architecture";
    PatternCategory["UI_UX"] = "ui_ux";
    PatternCategory["COLLABORATION"] = "collaboration";
    PatternCategory["PHILOSOPHY"] = "philosophy";
    PatternCategory["TECHNICAL"] = "technical";
    PatternCategory["PROCESS"] = "process";
})(PatternCategory = exports.PatternCategory || (exports.PatternCategory = {}));
var ImpactLevel;
(function (ImpactLevel) {
    ImpactLevel["LOW"] = "low";
    ImpactLevel["MEDIUM"] = "medium";
    ImpactLevel["HIGH"] = "high";
    ImpactLevel["CRITICAL"] = "critical";
})(ImpactLevel = exports.ImpactLevel || (exports.ImpactLevel = {}));
var PredictionStatus;
(function (PredictionStatus) {
    PredictionStatus["PENDING"] = "pending";
    PredictionStatus["VALIDATED"] = "validated";
    PredictionStatus["REJECTED"] = "rejected";
    PredictionStatus["EVOLVED"] = "evolved";
})(PredictionStatus = exports.PredictionStatus || (exports.PredictionStatus = {}));
var MissionPriority;
(function (MissionPriority) {
    MissionPriority["LOW"] = "low";
    MissionPriority["MEDIUM"] = "medium";
    MissionPriority["HIGH"] = "high";
    MissionPriority["URGENT"] = "urgent";
    MissionPriority["CRITICAL"] = "critical";
})(MissionPriority = exports.MissionPriority || (exports.MissionPriority = {}));
var MissionCategory;
(function (MissionCategory) {
    MissionCategory["ARCHITECTURE"] = "architecture";
    MissionCategory["FEATURE"] = "feature";
    MissionCategory["REFACTOR"] = "refactor";
    MissionCategory["DOCUMENTATION"] = "documentation";
    MissionCategory["TESTING"] = "testing";
    MissionCategory["PHILOSOPHY"] = "philosophy";
    MissionCategory["PROCESS"] = "process";
})(MissionCategory = exports.MissionCategory || (exports.MissionCategory = {}));
var MissionStatus;
(function (MissionStatus) {
    MissionStatus["ASSIGNED"] = "assigned";
    MissionStatus["IN_PROGRESS"] = "in_progress";
    MissionStatus["BLOCKED"] = "blocked";
    MissionStatus["COMPLETED"] = "completed";
    MissionStatus["CANCELLED"] = "cancelled";
})(MissionStatus = exports.MissionStatus || (exports.MissionStatus = {}));
var ChangeType;
(function (ChangeType) {
    ChangeType["IMPROVEMENT"] = "improvement";
    ChangeType["OPTIMIZATION"] = "optimization";
    ChangeType["FEATURE_ADD"] = "feature_add";
    ChangeType["REFACTOR"] = "refactor";
    ChangeType["BUG_FIX"] = "bug_fix";
    ChangeType["PHILOSOPHY_ENHANCEMENT"] = "philosophy_enhancement";
})(ChangeType = exports.ChangeType || (exports.ChangeType = {}));
//# sourceMappingURL=index.js.map