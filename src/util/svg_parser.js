import fs from "fs";
import { XMLParser } from "fast-xml-parser";

function parsePath(d) {
    const tokens = d.match(/[MLZmlz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);

    const points = [];
    let i = 0;
    let cmd = null;

    while (i < tokens.length) {
        if (/^[MLZmlz]$/.test(tokens[i])) {
            cmd = tokens[i++];
            if (cmd === "Z" || cmd === "z") continue;
        }

        while (
            i + 1 < tokens.length &&
            !/^[MLZmlz]$/.test(tokens[i])
        ) {
            const x = Number(tokens[i++]);
            const y = Number(tokens[i++]);

            points.push([x, y]);

            // po pierwszym M kolejne punkty są L
            if (cmd === "M") cmd = "L";
            if (cmd === "m") cmd = "l";
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
                    points: parsePath(p.d)
                });
            }
        } else {
            collectPaths(value, out);
        }
    }

    return out;
}

const svgText = fs.readFileSync("../mapa.svg", "utf8");

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: ""
});

const xml = parser.parse(svgText);

const result = collectPaths(xml);

fs.writeFileSync(
    "../mapa.json",
    JSON.stringify(result, null, 2)
);

console.log(`Znaleziono ${result.length} ścieżek`);