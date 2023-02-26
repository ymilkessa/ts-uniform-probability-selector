import TextBuilderNode from "../src/textBuilderNode";

describe("Test TextBuilderNode", () => {
  // I'm ensuring that the lengths of these lists have unique
  // prime factors so that the weights of the nodes are unique.
  const startPhrases = [
    "I like",
    "Marty enjoys",
    "Satoshi hates",
    "Almaz loves",
    "John Wick is curious about",
  ];
  const fruits = [
    "apples.",
    "bananas.",
    "oranges.",
    "grapes.",
    "pears.",
    "strawberries.",
    "blueberries.",
    "pineapples.",
    "watermelons.",
    "mangos.",
    "kiwis.",
  ];
  const vehicleActions = ["riding in", "driving", "traveling in"];
  const vehicles = [
    "cars.",
    "trucks.",
    "buses.",
    "motorcycles.",
    "bicycles.",
    "boats.",
    "planes.",
    "trains.",
  ];

  const startPhrasesNode = new TextBuilderNode(startPhrases);
  const fruitsNode = new TextBuilderNode(fruits);
  const vehicleActionsNode = new TextBuilderNode(vehicleActions);
  const vehiclesNode = new TextBuilderNode(vehicles);

  beforeAll(() => {
    vehicleActionsNode.addChild(vehiclesNode);
    startPhrasesNode.addChild(fruitsNode);
    startPhrasesNode.addChild(vehicleActionsNode);
  });

  it("The text nodes have the expected weights", () => {
    const vehiclesWeight = vehicles.length;
    const vehicleActionsWeight = vehicleActions.length * vehiclesWeight;
    const fruitsWeight = fruits.length;
    const startPhrasesWeight =
      startPhrases.length * (fruitsWeight + vehicleActionsWeight);
    expect(fruitsNode.getWeight()).toBe(fruitsWeight);
    expect(vehiclesNode.getWeight()).toBe(vehiclesWeight);
    expect(vehicleActionsNode.getWeight()).toBe(vehicleActionsWeight);
    expect(startPhrasesNode.getWeight()).toBe(startPhrasesWeight);
  });

  it("recursiveSelection() for our test class returns a string that contains the given snippet", () => {
    const arbitrarySnippet = "some random snippet yo";
    const output = startPhrasesNode.recursiveSelection(arbitrarySnippet, null);
    const startIndex = output.length - arbitrarySnippet.length;
    expect(output.slice(startIndex, output.length)).toBe(arbitrarySnippet);
  });
});
