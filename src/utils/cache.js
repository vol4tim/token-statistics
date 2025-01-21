import fs from "fs";
import path from "path";
import { PATH_FILES } from "../config";

export function getCache(token, duration = 5000) {
  const file = path.join(PATH_FILES, "/" + token + ".json");
  if (fs.existsSync(file)) {
    let res;
    try {
      res = JSON.parse(
        fs.readFileSync(path.join(PATH_FILES, "/" + token + ".json")),
      );
    } catch (_) {}
    if (res && res.timestamp + duration > Date.now()) {
      return res.value;
    }
  }
  return false;
}

export function setCache(token, data) {
  fs.writeFileSync(
    path.join(PATH_FILES, "/" + token + ".json"),
    JSON.stringify({
      timestamp: Date.now(),
      value: data,
    }),
  );
}
