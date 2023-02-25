import { NumberBuilderNode } from "./numberBuilderNode";

describe("Test SelectionNode", () => {
  const oddNumbers = [1, 3, 5, 7, 9];
  const evenNumbers = [0, 2, 4, 6, 8];
  const allNumbers = [...oddNumbers, ...evenNumbers];

  const oddNumbersNode = new NumberBuilderNode(oddNumbers);
  const evenNumbersNode = new NumberBuilderNode(evenNumbers);
  const parentNode = new NumberBuilderNode(allNumbers);

  beforeAll(() => {
    parentNode.add_child(oddNumbersNode);
    parentNode.add_child(evenNumbersNode);
  });

  it("The child nodes have the expected weights", () => {
    expect(oddNumbersNode.getWeight()).toBe(oddNumbers.length);
    expect(evenNumbersNode.getWeight()).toBe(evenNumbers.length);
  });

  it("The parent node has the expected total weight", () => {
    expect(parentNode.getWeight()).toBe(
      (oddNumbers.length + evenNumbers.length) * allNumbers.length
    );
  });

  it("isLeaf() returns true for the leaf nodes and false for the non-leaf nodes", () => {
    expect(oddNumbersNode.isLeaf()).toBe(true);
    expect(evenNumbersNode.isLeaf()).toBe(true);
    expect(parentNode.isLeaf()).toBe(false);
  });

  it("getSomethingAtRandom() for our test class returns valid numbers.", () => {
    expect(typeof parentNode.getSomethingAtRandom()).toBe("number");
  });

  it("getSomethingUsingSnippet() for our test class returns numbers >= the given snippet number", () => {
    const snippet = 2;
    const output = parentNode.getSomethingUsingSnippet(snippet, null);
    expect(output).toBeGreaterThanOrEqual(snippet);
  });

  it("Ensure that computeAndSetWeights() updates the weight of the node", () => {
    const newOddNumbers = [...oddNumbers];
    const newOddNumbersNode = new NumberBuilderNode(newOddNumbers);
    const oldWeight = parentNode.getWeight();
    expect(newOddNumbersNode.getWeight()).toBe(oddNumbers.length);
    newOddNumbersNode.data.push(11);
    newOddNumbersNode.computeAndSetWeights();
    expect(newOddNumbersNode.getWeight()).toBe(oddNumbers.length + 1);
  });

  it("Ensure that computeAndSetWeights() updates the weight of the parent node", () => {
    const lastDigitNumber = new NumberBuilderNode([...oddNumbers]);
    const secondToLastDigitNumber = new NumberBuilderNode([...evenNumbers]);
    secondToLastDigitNumber.add_child(lastDigitNumber);
    const oldSize = evenNumbers.length * oddNumbers.length;
    expect(secondToLastDigitNumber.getWeight()).toBe(oldSize);
    lastDigitNumber.data = [...oddNumbers, ...evenNumbers];
    lastDigitNumber.computeAndSetWeights();
    expect(secondToLastDigitNumber.getWeight()).toBe(
      oldSize + evenNumbers.length * evenNumbers.length
    );
  });
});
