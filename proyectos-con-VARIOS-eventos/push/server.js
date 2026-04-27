/**
 * ╔══════════════════════════════════════════╗
 * ║  Servidor : PUSH()
 * ║  Puerto   : 3001
 * ║  URL      : http://localhost:3001
 * ║  Info     : Ejercicios con el método push()
 * ╚══════════════════════════════════════════╝
 */
'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');

var PORT      = 3001;
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
        // push() en array vacío: agrega cada fruta y muestra los pasos
        var frutas = body.frutas;
        var arr = [];
        var lines = ["Array inicial: []"];
        frutas.forEach(function(f) {
          var len = arr.push(f);
          lines.push("push(\"" + f + "\") → " + JSON.stringify(arr) + "  (longitud: " + len + ")");
        });
        lines.push("", "Array final: " + JSON.stringify(arr));
        json(res, { resultado: lines.join("\n") }); return;
      }
      if (url === '/api/ej2') {
        // push() a array existente: agrega 3 nuevos amigos
        var amigos = body.amigos; var nuevos = body.nuevos;
        var lines = ["Array inicial (amigos): " + JSON.stringify(amigos), ""];
        nuevos.forEach(function(n) {
          amigos.push(n);
          lines.push("push(\"" + n + "\") → " + JSON.stringify(amigos));
        });
        lines.push("", "Total de amigos: " + amigos.length);
        json(res, { resultado: lines.join("\n") }); return;
      }
      if (url === '/api/ej3') {
        // push() condicional: agrega solo si el nuevo > último
        var numeros = body.numeros; var nuevo = body.nuevo;
        var ultimo = numeros[numeros.length - 1];
        var lines = ["Array: " + JSON.stringify(numeros), "Último elemento: " + ultimo, "Número candidato: " + nuevo, ""];
        if (nuevo > ultimo) {
          numeros.push(nuevo);
          lines.push("✅ " + nuevo + " > " + ultimo + " → push() realizado");
          lines.push("Resultado: " + JSON.stringify(numeros));
        } else {
          lines.push("❌ " + nuevo + " ≤ " + ultimo + " → no se agrega");
          lines.push("Sin cambios: " + JSON.stringify(numeros));
        }
        json(res, { resultado: lines.join("\n") }); return;
      }
      json(res, { error: 'Endpoint no encontrado' }, 404);
    }).catch(function(err) { json(res, { error: err.message }, 400); });
    return;
  }
  res.writeHead(404); res.end('No encontrado');
});

server.listen(PORT, function() {
  console.log('\u2705  push() \u2192 http://localhost:' + PORT);
});