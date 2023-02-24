abstract class SelectionNode<ReturnType, StorageType> {
  children: Array<SelectionNode<ReturnType, StorageType>>;
  data: Array<StorageType>;
  weights: Array<number>;
  totalWeight: number | null;
  constructor(data: Array<StorageType>) {
    this.children = [];
    this.weights = [];
    this.data = data;
    this.totalWeight = 0;
  }

  add_child(child: SelectionNode<ReturnType, StorageType>) {
    if (this.totalWeight === null) {
      this.totalWeight = this.computeAndSetWeight();
    }
    this.children.push(child);
    this.weights.push(child.getWeight());
    this.totalWeight += child.getWeight();
  }

  isLeaf(): boolean {
    return this.children.length === 0;
  }

  getWeight(): number {
    if (this.totalWeight === null) {
      this.totalWeight = this.computeAndSetWeight();
    }
    return this.totalWeight;
  }

  getSomethingAtRandom(): ReturnType {
    if (this.isLeaf()) {
      return this.getSomethingUsingSnippet(null, null);
    }
    // TODO this just selects a child using an unweighted random selection
    const nextChildIndex = Math.floor(Math.random() * this.children.length);
    const outputFromChild =
      this.children[nextChildIndex].getSomethingAtRandom();
    return this.getSomethingUsingSnippet(outputFromChild, nextChildIndex);
  }

  /**
   * This should be where any use-case specific logic happens regarding the
   * search and select item sequence.
   * This function should define the base cases for when this node is a leaf,
   * as well as the recursive case for when this is not a leaf.
   */
  abstract getSomethingUsingSnippet(
    snippet: ReturnType | null,
    childIndexUsed: number | null
  ): ReturnType;
  abstract computeAndSetWeight(): number;
}
