/**
 * ╔══════════════════════════════════════════╗
 * ║  Servidor : SLICE()
 * ║  Puerto   : 3006
 * ║  URL      : http://localhost:3006
 * ║  Info     : Ejercicios con el método slice()
 * ╚══════════════════════════════════════════╝
 */
'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');

var PORT      = 3006;
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
        var copia = numeros.slice(0, 3);
        json(res, { resultado: ["Original: " + JSON.stringify(numeros), "", "numeros.slice(0, 3):", "Copia: " + JSON.stringify(copia), "", "✅ El original no fue modificado: " + JSON.stringify(numeros)].join("\n") }); return;
      }
      if (url === '/api/ej2') {
        var peliculas = body.peliculas;
        var seleccion = peliculas.slice(2, 5);
        json(res, { resultado: ["Array completo: " + JSON.stringify(peliculas), "", "peliculas.slice(2, 5):", "Selección: " + JSON.stringify(seleccion), "", "✅ Original intacto: " + JSON.stringify(peliculas)].join("\n") }); return;
      }
      if (url === '/api/ej3') {
        var items = body.items;
        var ultimos = items.slice(-3);
        json(res, { resultado: ["Original: " + JSON.stringify(items), "", "items.slice(-3) → últimos 3:", "Copia: " + JSON.stringify(ultimos), "", "✅ Original sin modificar: " + JSON.stringify(items)].join("\n") }); return;
      }
      json(res, { error: 'Endpoint no encontrado' }, 404);
    }).catch(function(err) { json(res, { error: err.message }, 400); });
    return;
  }
  res.writeHead(404); res.end('No encontrado');
});

server.listen(PORT, function() {
  console.log('\u2705  slice() \u2192 http://localhost:' + PORT);
});