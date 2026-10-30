/**
 * Shapes returned by the backend. Documented with JSDoc so the editor can
 * autocomplete them without adding a TypeScript build step.
 */

/**
 * @typedef {"SUCCESS" | "ERROR"} CallStatus
 */

/**
 * @typedef {Object} ServiceCallLog
 * @property {string} requestId
 * @property {string} serviceId
 * @property {string} operation
 * @property {CallStatus} status
 * @property {number} durationMs
 * @property {string} timestamp ISO-8601
 * @property {unknown} params
 * @property {unknown} result
 * @property {string | null} errorMessage
 * @property {string | null} errorStackTrace
 */

/**
 * @typedef {Object} LogPage
 * @property {ServiceCallLog[]} content
 * @property {number} page
 * @property {number} size
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {Object} ServiceMetrics
 * @property {string} serviceId
 * @property {number} totalCalls
 * @property {number} successCalls
 * @property {number} errorCalls
 * @property {number} successRate 0..1
 * @property {number} errorRate 0..1
 * @property {number} averageResponseTimeMs
 * @property {number} maxResponseTimeMs
 * @property {string | null} lastCallAt
 * @property {boolean} degraded true when the error rate is above 15%
 */

/**
 * @typedef {Object} MetricsSummary
 * @property {string} generatedAt
 * @property {number} totalCalls
 * @property {number} totalErrors
 * @property {number} overallErrorRate
 * @property {number} averageResponseTimeMs
 * @property {ServiceMetrics[]} services
 */

/**
 * @typedef {Object} LogFilters
 * @property {string} [service]
 * @property {CallStatus | ""} [status]
 * @property {string} [from] datetime-local value
 * @property {string} [to] datetime-local value
 */

export {};
