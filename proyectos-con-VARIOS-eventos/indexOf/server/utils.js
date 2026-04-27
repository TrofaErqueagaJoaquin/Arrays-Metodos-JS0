/**
 * utils.js — Utilidades de servidor compartidas
 * (disponible para importar desde cualquier servidor con require("../server/utils"))
 */
'use strict';

/** Convierte un string CSV a array de strings limpio */
function csvToArray(str) {
  return str.split(",").map(function(s){return s.trim();}).filter(Boolean);
}

/** Convierte un string CSV a array de números */
function csvToNumbers(str) {
  return str.split(",").map(function(s){return Number(s.trim());}).filter(function(n){return !isNaN(n);});
}

/** Genera una respuesta de error estándar */
function errorResponse(res, message, code) {
  res.writeHead(code || 400, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify({ error: message }));
}

module.exports = { csvToArray: csvToArray, csvToNumbers: csvToNumbers, errorResponse: errorResponse };