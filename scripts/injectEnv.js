const fs = require("fs");

const NGINX_INDEX_FILE = "/usr/share/nginx/html/index.html";

const clientEnvVars = {};
for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith("REACT_APP_")) {
    clientEnvVars[key] = value;
  }
}

fs.readFile(NGINX_INDEX_FILE, "utf8", function (err, html) {
  if (err) {
    console.error(err);
    return;
  }

  fs.writeFile(
    NGINX_INDEX_FILE,
    html.replace('"__ENV__"', JSON.stringify(clientEnvVars)),
    "utf8",
    function (err) {
      if (err) {
        console.error(err);
      }
    }
  );
});
