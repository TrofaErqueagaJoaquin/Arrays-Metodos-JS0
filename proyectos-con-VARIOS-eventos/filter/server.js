/**
 * ╔══════════════════════════════════════════╗
 * ║  Servidor : FILTER()
 * ║  Puerto   : 3011
 * ║  URL      : http://localhost:3011
 * ║  Info     : Ejercicios con el método filter()
 * ╚══════════════════════════════════════════╝
 */
'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');

var PORT      = 3011;
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
        var filtrados = numeros.filter(function(n) { return n > 10; });
        var rechazados = numeros.filter(function(n) { return n <= 10; });
        json(res, { resultado: ["Original: " + JSON.stringify(numeros), "filter(n => n > 10):", "", "✅ Pasan el filtro: " + JSON.stringify(filtrados), "❌ Descartados (≤10): " + JSON.stringify(rechazados)].join("\n") }); return;
      }
      if (url === '/api/ej2') {
        var palabras = body.palabras;
        var largas = palabras.filter(function(p) { return p.length > 5; });
        var lines = ["Original: " + JSON.stringify(palabras), "filter(p => p.length > 5):", ""];
        palabras.forEach(function(p) { lines.push((p.length > 5 ? "✅" : "❌") + " \"" + p + "\" (" + p.length + " letras)"); });
        lines.push("", "Filtradas: " + JSON.stringify(largas));
        json(res, { resultado: lines.join("\n") }); return;
      }
      if (url === '/api/ej3') {
        var usuarios = body.usuarios;
        var activos = usuarios.filter(function(u) { return u.activo; });
        var lines = ["Usuarios:", ""];
        usuarios.forEach(function(u) { lines.push((u.activo ? "🟢" : "🔴") + " " + u.nombre + " — " + (u.activo ? "ACTIVO" : "INACTIVO")); });
        lines.push("", "Activos: " + JSON.stringify(activos.map(function(u){return u.nombre;})));
        json(res, { resultado: lines.join("\n") }); return;
      }
      json(res, { error: 'Endpoint no encontrado' }, 404);
    }).catch(function(err) { json(res, { error: err.message }, 400); });
    return;
  }
  res.writeHead(404); res.end('No encontrado');
});

server.listen(PORT, function() {
  console.log('\u2705  filter() \u2192 http://localhost:' + PORT);
});