import { dagToTree } from "../core";
import data0 from "./data/data0.json";
import data2 from "./data/data2.json";
import data3 from "./data/data3.json";

describe("core", () => {
  it("dagToTree basic", () => {
    const { lines, nodes } = data0;
    const tree = dagToTree(lines, nodes);
    console.log(data0, tree);
  });

  it("dagToTree single router", () => {
    const { lines, nodes } = data2;
    const tree = dagToTree(lines, nodes);
    console.log(data2, JSON.stringify(tree, null, 2));
  });

  it("dagToTree nested router", () => {
    const { lines, nodes } = data3;
    const tree = dagToTree(lines, nodes);
    console.log(data3, JSON.stringify(tree, null, 2));
  });
});
