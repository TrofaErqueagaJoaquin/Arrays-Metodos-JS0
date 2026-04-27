/**
 * ╔══════════════════════════════════════════╗
 * ║  Servidor : MAP()
 * ║  Puerto   : 3010
 * ║  URL      : http://localhost:3010
 * ║  Info     : Ejercicios con el método map()
 * ╚══════════════════════════════════════════╝
 */
'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');

var PORT      = 3010;
var PAGE_PATH = path.join(__dirname, './index.html');



/** Parsea body JSON de una petición POST */
function parseBody(req) {
  return new Promise(function(res, rej) {
    var raw = '';
    req.on('data', function(c) { raw += c.toString(); });
    req.on('end', function() { try { res(JSON.parse(raw)); } catch(e) { rej(new Error('JSON inválido')); } });
  });
}

/** Envía respuesta JSON con CORS */
function json(res, data, code) {
  code = code || 200;
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' });
  res.end(JSON.stringify(data));
}

/** Sirve el HTML al navegador */
function serveHTML(res) {
  fs.readFile(PAGE_PATH, 'utf8', function(err, html) {
    if (err) { res.writeHead(500); res.end('Error al cargar la página'); return; }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  });
}

/* ═══════════════════ SERVIDOR HTTP ═══════════════════ */
var server = http.createServer(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.method === 'GET' && req.url === '/') { serveHTML(res); return; }
  if (req.method === 'POST') {
    parseBody(req).then(function(body) {
      var url = req.url;
      if (url === '/api/ej1') {
        var numeros = body.numeros;
        var triplicado = numeros.map(function(n) { return n * 3; });
        var lines = ["Original: " + JSON.stringify(numeros), "map(n => n * 3):", "Resultado: " + JSON.stringify(triplicado), ""];
        numeros.forEach(function(n, i) { lines.push(n + " × 3 = " + triplicado[i]); });
        json(res, { resultado: lines.join("\n") }); return;
      }
      if (url === '/api/ej2') {
        var nombres = body.nombres;
        var mayus = nombres.map(function(n) { return n.toUpperCase(); });
        json(res, { resultado: ["Original: " + JSON.stringify(nombres), "map(n => n.toUpperCase()):", "Resultado: " + JSON.stringify(mayus)].join("\n") }); return;
      }
      if (url === '/api/ej3') {
        var precios = body.precios;
        var conIVA = precios.map(function(p) { return Math.round(p * 1.21 * 100) / 100; });
        var lines = ["Precios originales: " + JSON.stringify(precios), "Con 21% IVA: " + JSON.stringify(conIVA), ""];
        precios.forEach(function(p, i) { lines.push("$" + p + " + 21% = $" + conIVA[i]); });
        json(res, { resultado: lines.join("\n") }); return;
      }
      json(res, { error: 'Endpoint no encontrado' }, 404);
    }).catch(function(err) { json(res, { error: err.message }, 400); });
    return;
  }
  res.writeHead(404); res.end('No encontrado');
});

server.listen(PORT, function() {
  console.log('\u2705  map() \u2192 http://localhost:' + PORT);
});