/**
 * ╔══════════════════════════════════════════╗
 * ║  Servidor : SHIFT()
 * ║  Puerto   : 3004
 * ║  URL      : http://localhost:3004
 * ║  Info     : Ejercicios con el método shift()
 * ╚══════════════════════════════════════════╝
 */
'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');

var PORT      = 3004;
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
        var numeros = body.numeros; var copia = numeros.slice();
        var eliminado = numeros.shift();
        json(res, { resultado: ["Array original: " + JSON.stringify(copia), "", "❌ Eliminado (shift): " + eliminado, "", "Array resultante: " + JSON.stringify(numeros)].join("\n") }); return;
      }
      if (url === '/api/ej2') {
        var mensajes = body.mensajes; var copia = mensajes.slice();
        var eliminado = mensajes.shift();
        json(res, { resultado: ["Mensajes: " + JSON.stringify(copia), "", "shift() elimina el primero:", "❌ \"" + eliminado + "\"", "", "Restantes: " + JSON.stringify(mensajes)].join("\n") }); return;
      }
      if (url === '/api/ej3') {
        var cola = body.cola || [];
        json(res, { resultado: "Cola actual: " + JSON.stringify(cola) + "\nUsar los botones Agregar / Atender para simular la cola.\nshift() remueve el primero de la fila." }); return;
      }
      json(res, { error: 'Endpoint no encontrado' }, 404);
    }).catch(function(err) { json(res, { error: err.message }, 400); });
    return;
  }
  res.writeHead(404); res.end('No encontrado');
});

server.listen(PORT, function() {
  console.log('\u2705  shift() \u2192 http://localhost:' + PORT);
});