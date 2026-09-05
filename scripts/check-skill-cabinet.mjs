import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(readFileSync(new URL("../components/summit/SkillCabinet.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function mount() {
  const listeners = new Map();
  const effects = [];
  const refs = [];
  const toggles = new Set();
  let selected = 0;
  const skills = Array.from({ length: 6 }, (_, index) => ({ category: `Field ${index}`, description: `Description ${index}`, tools: [`Tool ${index}`] }));
  const fields = skills.map((_, index) => {
    let open = index === 0;
    return {
      get open() { return open; },
      set open(value) { if (open !== value) { open = value; toggles.add(index); } },
    };
  });
  const root = { querySelectorAll: () => fields };
  const window = {
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name) => listeners.delete(name),
  };
  const context = {
    exports: {}, window,
    require: (name) => {
      if (name === "@/lib/constants") return { SKILLS: skills };
      if (name === "./CrystalScene") return { CrystalScene: () => null };
      if (name === "lucide-react") return { ChevronDown: () => null };
      if (name === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      assert.equal(name, "react");
      return {
        useRef: (value) => { const ref = { current: refs.length === 0 ? root : value }; refs.push(ref); return ref; },
        useState: () => [0, (index) => { selected = index; }],
        useEffect: (effect) => effects.push(effect),
      };
    },
  };
  vm.runInNewContext(source, context);
  const markup = context.exports.SkillCabinet();
  const details = markup.props.children[1].props.children;
  const cleanups = effects.map((effect) => effect());
  const flush = () => {
    const pending = [...toggles];
    toggles.clear();
    pending.forEach((index) => details[index].props.onToggle({ currentTarget: fields[index] }));
  };
  return {
    fields, details, flush,
    selected: () => selected,
    toggle: (index) => {
      details[index].props.children[0].props.onClick();
      fields[index].open = !fields[index].open;
    },
    print: () => listeners.get("beforeprint")?.(),
    afterPrint: () => listeners.get("afterprint")?.(),
    unmount: () => { cleanups.forEach((cleanup) => cleanup()); assert.equal(listeners.size, 0, "Unmount must remove print listeners"); },
  };
}

const cabinet = mount();
assert.deepEqual(cabinet.fields.map((field) => field.open), [true, false, false, false, false, false]);
assert.equal(cabinet.details[0].props.open, true, "The first field must be readable before JavaScript loads");
cabinet.toggle(2);
cabinet.flush();
cabinet.toggle(4);
cabinet.flush();
assert.equal(cabinet.selected(), 4);
const openBeforePrint = cabinet.fields.map((field) => field.open);
assert.equal(openBeforePrint.filter(Boolean).length, 3, "Native fields must support multiple open disclosures");
cabinet.print();
assert(cabinet.fields.every((field) => field.open), "All skill content must be available during print");
cabinet.flush();
assert.equal(cabinet.selected(), 4, "Print-generated toggle events must not change the selected study");
cabinet.print();
cabinet.afterPrint();
assert.deepEqual(cabinet.fields.map((field) => field.open), openBeforePrint, "Repeated beforeprint must not replace the original disclosure snapshot");
cabinet.flush();
assert.equal(cabinet.selected(), 4, "Restoration-generated events must preserve the original selected study");

// Print dialogs can block delivery of toggle events until after afterprint.
cabinet.print();
cabinet.afterPrint();
cabinet.flush();
assert.equal(cabinet.selected(), 4, "Delayed print toggles must read the restored DOM state before selecting a field");
assert.deepEqual(cabinet.fields.map((field) => field.open), openBeforePrint);
cabinet.toggle(5);
cabinet.flush();
assert.equal(cabinet.selected(), 5, "Normal interaction must resume after printing");
cabinet.toggle(0);
cabinet.flush();
assert.equal(cabinet.fields[0].open, false, "The initially open field must remain natively closable");
cabinet.unmount();

const interruptedPrint = mount();
const initialState = interruptedPrint.fields.map((field) => field.open);
interruptedPrint.print();
interruptedPrint.unmount();
assert.deepEqual(interruptedPrint.fields.map((field) => field.open), initialState, "Unmounting during print must restore native disclosure state");

console.log("Skill cabinet checks passed: native multiple-open fields, initial SSR disclosure, print completeness, selection preservation, delayed toggle delivery, repeat print events and cleanup.");
