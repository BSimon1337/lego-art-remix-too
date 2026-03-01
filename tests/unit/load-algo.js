import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

class HeapStub {
  constructor(comparator) {
    this.comparator = comparator;
    this.values = [];
  }
  push(value) {
    this.values.push(value);
    this.values.sort(this.comparator);
  }
  pop() {
    return this.values.shift();
  }
  size() {
    return this.values.length;
  }
}

export function loadAlgoFunctions() {
  const algoPath = path.resolve(process.cwd(), "app/js/algo.js");
  const code = fs.readFileSync(algoPath, "utf8");
  const sandbox = {
    Math,
    Number,
    String,
    Object,
    Array,
    parseInt,
    console,
    Heap: HeapStub
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: "app/js/algo.js" });
  return sandbox;
}
