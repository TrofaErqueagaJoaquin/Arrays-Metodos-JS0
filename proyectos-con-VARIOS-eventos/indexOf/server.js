/**
 * ╔══════════════════════════════════════════╗
 * ║  Servidor : INDEXOF()
 * ║  Puerto   : 3007
 * ║  URL      : http://localhost:3007
 * ║  Info     : Ejercicios con el método indexOf()
 * ╚══════════════════════════════════════════╝
 */
'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');

var PORT      = 3007;
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
        var palabras = body.palabras; var buscar = body.buscar;
        var idx = palabras.indexOf(buscar);
        var msg = idx !== -1
          ? ["✅ \"" + buscar + "\" encontrado en el índice: " + idx, "Array: " + JSON.stringify(palabras), "      " + " ".repeat(JSON.stringify(palabras.slice(0,idx+1)).length - 3) + "^↑ índice " + idx]
          : ["❌ \"" + buscar + "\" no se encontró en el array.", "indexOf() devuelve: -1"];
        json(res, { resultado: msg.join("\n") }); return;
      }
      if (url === '/api/ej2') {
        var numeros = body.numeros; var buscar = body.buscar;
        var idx = numeros.indexOf(buscar);
        var lines = ["Array: " + JSON.stringify(numeros), "Buscando: " + buscar, ""];
        if (idx !== -1) { lines.push("✅ Encontrado en el índice: " + idx); lines.push("(Primera ocurrencia)"); }
        else { lines.push("❌ No encontrado. indexOf() devuelve: -1"); }
        json(res, { resultado: lines.join("\n") }); return;
      }
      if (url === '/api/ej3') {
        var ciudades = body.ciudades; var buscar = body.buscar;
        var idx = ciudades.indexOf(buscar);
        var lines = ["Ciudades: " + JSON.stringify(ciudades), "Buscando: \"" + buscar + "\"", ""];
        if (idx !== -1) { lines.push("✅ \"" + buscar + "\" está en el índice: " + idx); }
        else { lines.push("❌ \"" + buscar + "\" no está en la lista de ciudades."); lines.push("indexOf() devuelve: -1"); }
        json(res, { resultado: lines.join("\n") }); return;
      }
      json(res, { error: 'Endpoint no encontrado' }, 404);
    }).catch(function(err) { json(res, { error: err.message }, 400); });
    return;
  }
  res.writeHead(404); res.end('No encontrado');
});

server.listen(PORT, function() {
  console.log('\u2705  indexOf() \u2192 http://localhost:' + PORT);
});