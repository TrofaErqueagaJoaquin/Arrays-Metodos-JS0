/**
 * ╔══════════════════════════════════════════╗
 * ║  Servidor : REVERSE()
 * ║  Puerto   : 3014
 * ║  URL      : http://localhost:3014
 * ║  Info     : Ejercicios con el método reverse()
 * ╚══════════════════════════════════════════╝
 */
'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');

var PORT      = 3014;
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
        letras.reverse();
        json(res, { resultado: ["Original: " + JSON.stringify(original), "reverse():", "Invertido: " + JSON.stringify(letras), "", "⚠️ reverse() modifica el array original"].join("\n") }); return;
      }
      if (url === '/api/ej2') {
        var numeros = body.numeros; var original = numeros.slice();
        numeros.reverse();
        json(res, { resultado: ["Original: " + JSON.stringify(original), "reverse():", "Invertido: " + JSON.stringify(numeros)].join("\n") }); return;
      }
      if (url === '/api/ej3') {
        var texto = body.texto;
        var chars = texto.split("");
        var invertido = chars.slice().reverse().join("");
        json(res, { resultado: ["Texto original: \"" + texto + "\"", "", "Pasos:", "1. split(\"\") → " + JSON.stringify(chars), "2. reverse() → " + JSON.stringify(chars.slice().reverse()), "3. join(\"\") → \"" + invertido + "\"", "", "Resultado: \"" + invertido + "\""].join("\n") }); return;
      }
      json(res, { error: 'Endpoint no encontrado' }, 404);
    }).catch(function(err) { json(res, { error: err.message }, 400); });
    return;
  }
  res.writeHead(404); res.end('No encontrado');
});

server.listen(PORT, function() {
  console.log('\u2705  reverse() \u2192 http://localhost:' + PORT);
});