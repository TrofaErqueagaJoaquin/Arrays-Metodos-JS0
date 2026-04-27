/**
 * ╔══════════════════════════════════════════╗
 * ║  Servidor : INCLUDES()
 * ║  Puerto   : 3008
 * ║  URL      : http://localhost:3008
 * ║  Info     : Ejercicios con el método includes()
 * ╚══════════════════════════════════════════╝
 */
'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');

var PORT      = 3008;
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
        var existe = palabras.includes(buscar);
        json(res, { resultado: ["Array: " + JSON.stringify(palabras), "includes(\"" + buscar + "\"): " + existe, "", existe ? "✅ SÍ contiene \"" + buscar + "\"" : "❌ NO contiene \"" + buscar + "\""].join("\n") }); return;
      }
      if (url === '/api/ej2') {
        var colores = body.colores; var buscar = body.buscar;
        var existe = colores.includes(buscar);
        json(res, { resultado: ["Colores: " + JSON.stringify(colores), "Buscando: \"" + buscar + "\"", "", "includes() → " + existe, "", existe ? "✅ El color \"" + buscar + "\" existe en el array" : "❌ El color \"" + buscar + "\" NO existe"].join("\n") }); return;
      }
      if (url === '/api/ej3') {
        var numeros = body.numeros; var nuevo = body.nuevo;
        var yaExiste = numeros.includes(nuevo);
        var lines = ["Array: " + JSON.stringify(numeros), "Intentando agregar: " + nuevo, "", "includes(" + nuevo + ") → " + yaExiste, ""];
        if (!yaExiste) { numeros.push(nuevo); lines.push("✅ No existe → push() realizado"); lines.push("Nuevo array: " + JSON.stringify(numeros)); }
        else { lines.push("❌ Ya existe → no se agrega (evita duplicado)"); lines.push("Array sin cambios: " + JSON.stringify(numeros)); }
        json(res, { resultado: lines.join("\n") }); return;
      }
      json(res, { error: 'Endpoint no encontrado' }, 404);
    }).catch(function(err) { json(res, { error: err.message }, 400); });
    return;
  }
  res.writeHead(404); res.end('No encontrado');
});

server.listen(PORT, function() {
  console.log('\u2705  includes() \u2192 http://localhost:' + PORT);
});