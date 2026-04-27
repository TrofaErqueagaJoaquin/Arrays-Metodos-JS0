/**
 * ╔══════════════════════════════════════════╗
 * ║  Servidor : SPLICE()
 * ║  Puerto   : 3005
 * ║  URL      : http://localhost:3005
 * ║  Info     : Ejercicios con el método splice()
 * ╚══════════════════════════════════════════╝
 */
'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');

var PORT      = 3005;
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
        var letras = body.letras; var original = letras.slice();
        var eliminados = letras.splice(1, 2);
        json(res, { resultado: ["Original: " + JSON.stringify(original), "", "letras.splice(1, 2)", "❌ Eliminados: " + JSON.stringify(eliminados), "", "Resultado: " + JSON.stringify(letras)].join("\n") }); return;
      }
      if (url === '/api/ej2') {
        var nombres = body.nombres; var nuevo = body.nuevo; var original = nombres.slice();
        nombres.splice(2, 0, nuevo);
        json(res, { resultado: ["Original: " + JSON.stringify(original), "", "nombres.splice(2, 0, \"" + nuevo + "\")", "(0 eliminados, inserción en índice 2)", "", "Resultado: " + JSON.stringify(nombres)].join("\n") }); return;
      }
      if (url === '/api/ej3') {
        var arr = body.arr; var pos = body.pos; var nuevos = body.nuevos; var original = arr.slice();
        var reemplazados = arr.splice.apply(arr, [pos, 2].concat(nuevos));
        json(res, { resultado: ["Original: " + JSON.stringify(original), "", "arr.splice(" + pos + ", 2, " + nuevos.map(function(x){return "\""+x+"\"";}).join(", ") + ")", "❌ Reemplazados: " + JSON.stringify(reemplazados), "", "Resultado: " + JSON.stringify(arr)].join("\n") }); return;
      }
      json(res, { error: 'Endpoint no encontrado' }, 404);
    }).catch(function(err) { json(res, { error: err.message }, 400); });
    return;
  }
  res.writeHead(404); res.end('No encontrado');
});

server.listen(PORT, function() {
  console.log('\u2705  splice() \u2192 http://localhost:' + PORT);
});