import SelectionNode from "./selectionNode";

class TextBuilderNode extends SelectionNode<string, Array<string>> {
  constructor(data: Array<string>) {
    super(data);
  }

  getSomethingUsingSnippet(
    snippet: string | null,
    _childIndexUsed: number | null = null
  ): string {
    const snippetIndex = Math.floor(Math.random() * this.data.length);
    const snippetToUse = this.data[snippetIndex];
    if (this.isLeaf()) {
      return snippetToUse;
    }
    if (snippet === null) {
      throw new Error("Error: given text snippet is null.");
    }
    return snippetToUse + " " + snippet;
  }

  computeWeight(): number {
    if (this.isLeaf()) {
      return this.data.length;
    }
    return this.data.length * this.getSumOfChildWeights();
  }
}

export default TextBuilderNode;
