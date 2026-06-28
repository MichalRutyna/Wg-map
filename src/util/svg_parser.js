import fs from "fs";
import { XMLParser } from "fast-xml-parser";

function tokenize(d) {
    return d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
}

function parsePath(d) {
    const tokens = tokenize(d);
    if (!tokens) return [];

    let i = 0;

    let x = 0;
    let y = 0;

    let startX = 0;
    let startY = 0;

    const points = [];

    let cmd = null;

    const isCmd = (t) => /^[a-zA-Z]$/.test(t);

    while (i < tokens.length) {
        let t = tokens[i++];

        if (isCmd(t)) {
            cmd = t;
        } else {
            i--;
        }

        switch (cmd) {
            case "M":
            case "L":
                while (i + 1 < tokens.length && !isCmd(tokens[i])) {
                    x = Number(tokens[i++]);
                    y = Number(tokens[i++]);

                    points.push([x, y]);

                    if (cmd === "M") {
                        startX = x;
                        startY = y;
                        cmd = "L";
                    }
                }
                break;

            case "m":
            case "l":
                while (i + 1 < tokens.length && !isCmd(tokens[i])) {
                    x += Number(tokens[i++]);
                    y += Number(tokens[i++]);

                    points.push([x, y]);

                    if (cmd === "m") {
                        startX = x;
                        startY = y;
                        cmd = "l";
                    }
                }
                break;

            case "H":
                while (i < tokens.length && !isCmd(tokens[i])) {
                    x = Number(tokens[i++]);
                    points.push([x, y]);
                }
                break;

            case "h":
                while (i < tokens.length && !isCmd(tokens[i])) {
                    x += Number(tokens[i++]);
                    points.push([x, y]);
                }
                break;

            case "V":
                while (i < tokens.length && !isCmd(tokens[i])) {
                    y = Number(tokens[i++]);
                    points.push([x, y]);
                }
                break;

            case "v":
                while (i < tokens.length && !isCmd(tokens[i])) {
                    y += Number(tokens[i++]);
                    points.push([x, y]);
                }
                break;

            case "Z":
            case "z":
                // zamknij ścieżkę
                if (points.length) {
                    points.push([startX, startY]);
                }
                break;
        }
    }

    return points;
}

function collectPaths(node, out = []) {
    if (!node || typeof node !== "object") return out;

    for (const [key, value] of Object.entries(node)) {
        if (key === "path") {
            const paths = Array.isArray(value) ? value : [value];

            for (const p of paths) {
                out.push({
                    id: p.id ?? null,
                    name: p["inkscape:label"] ?? p.id ?? null,
                    points: parsePath(p.d)
                });
            }
        } else {
            collectPaths(value, out);
        }
    }

    return out;
}

const svgText = fs.readFileSync("src/assets/mapa.svg", "utf8");

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: ""
});

const xml = parser.parse(svgText);

const result = collectPaths(xml);

fs.writeFileSync(
    "src/assets/mapa.json",
    JSON.stringify(result, null, 2)
);

console.log(`Znaleziono ${result.length} ścieżek`);