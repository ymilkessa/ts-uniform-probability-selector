import SelectionNode from "../src/selectionNode";

export class NumberBuilderNode extends SelectionNode<number, Array<number>> {
  constructor(data: Array<number> = []) {
    super(data);
  }

  recursiveSelection(
    snippet: number | null,
    _childIndexUsed: number | null = null
  ): number {
    const snippetIndex = Math.floor(Math.random() * this.data!.length);
    const snippetToUse = this.data![snippetIndex];
    if (this.isLeaf()) {
      return snippetToUse;
    }
    if (snippet === null) {
      throw new Error("Error: given number snippet is null.");
    }
    return 10 * snippetToUse + snippet;
  }

  computeWeight(): number {
    if (this.isLeaf()) {
      return this.data!.length;
    }
    return this.data!.length * this.getSumOfChildWeights();
  }
}
