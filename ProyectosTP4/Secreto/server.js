/**
 * ╔══════════════════════════════════════════╗
 * ║  Servidor : SECRETO()
 * ║  Puerto   : 3015
 * ║  URL      : http://localhost:3015
 * ║  Info     : Ejercicio especial: Mensajes Secretos (SECRETO.EXE)
 * ╚══════════════════════════════════════════╝
 */
'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');

var PORT      = 3015;
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
      /**
       * Función decodificadora: invierte el contenido de cada sección entre paréntesis.
       * Algoritmo: recorre char a char; al encontrar "(" acumula hasta ")" y revierte.
       */
      function decode(msg) {
        var result = ""; var i = 0;
        while (i < msg.length) {
          if (msg[i] === "(") {
            var j = i + 1; var inner = "";
            while (j < msg.length && msg[j] !== ")") { inner += msg[j]; j++; }
            result += inner.split("").reverse().join("");
            i = j + 1;
          } else { result += msg[i]; i++; }
        }
        return result;
      }

      if (url === '/api/ej1' || url === '/api/ej2' || url === '/api/ej3') {
        var mensaje = body.mensaje;
        var decoded = decode(mensaje);
        // Detectar fragmentos codificados para mostrar el análisis
        var fragmentos = [];
        var re = /\(([^)]+)\)/g; var m;
        while ((m = re.exec(mensaje)) !== null) {
          fragmentos.push({ codificado: "(" + m[1] + ")", decodificado: m[1].split("").reverse().join("") });
        }
        var lines = ["Mensaje codificado:", mensaje, "", "Análisis de fragmentos:"];
        if (fragmentos.length === 0) { lines.push("  (ningún fragmento entre paréntesis encontrado)"); }
        else { fragmentos.forEach(function(f, i) { lines.push("  [" + (i+1) + "] " + f.codificado + " → \"" + f.decodificado + "\""); }); }
        lines.push("", "Mensaje decodificado:", decoded);
        json(res, { resultado: lines.join("\n") }); return;
      }
      json(res, { error: 'Endpoint no encontrado' }, 404);
    }).catch(function(err) { json(res, { error: err.message }, 400); });
    return;
  }
  res.writeHead(404); res.end('No encontrado');
});

server.listen(PORT, function() {
  console.log('\u2705  secreto() \u2192 http://localhost:' + PORT);
});