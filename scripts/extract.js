function get_models() {
    const results = {};
    const tr = [...document.querySelector("table").querySelectorAll("tr")];

    let type = "";

    tr.forEach((row) => {
        const type_elm = row.querySelector("strong");
        const link_elm = row.querySelector("a");
        if (type_elm) {
            type = type_elm.textContent.trim().toLowerCase().split("/")[0].replace(/\s+/g, "-");
            results[type] = [];
        } else if (link_elm) {
            const name = link_elm.textContent.trim();
            const url = link_elm.getAttribute("href");
            const size = parse_size(row.querySelector("td:nth-child(2)").textContent.trim());
            const license = row.querySelector("td:nth-child(5)").textContent.trim();
            results[type].push({ name, url, size, license });
        }
    });

    Object.keys(results).forEach((type) => {
        results[type].sort((a, b) => a.size - b.size);
    });

    return JSON.stringify(results);
}

function parse_size(raw) {
    const n = parseFloat(raw.match(/\d+\.?\d*/)[0]);

    if (raw.endsWith("K")) {
        return Math.floor(n * 1024);
    }
    if (raw.endsWith("M")) {
        return Math.floor(n * 1024 * 1024);
    }
    if (raw.endsWith("G") || raw.endsWith("Gb")) {
        return Math.floor(n * 1024 * 1024 * 1024);
    }

    return Math.floor(n);
}
