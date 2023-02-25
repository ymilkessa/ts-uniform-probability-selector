abstract class SelectionNode<ReturnType, StorageType> {
  private children: Array<SelectionNode<ReturnType, StorageType>>;
  data: StorageType;
  private cumWeights: Array<number>;
  /**
   * This is the NOT just the sum of weights of the child nodes.
   * It is rather the number of unique items that can be generated
   * from this node.
   */
  private totalWeight: number | null;
  /**
   * This is a pointer to the parent node.
   */
  parent: SelectionNode<ReturnType, StorageType> | null;

  constructor(data: StorageType) {
    this.children = [];
    this.cumWeights = [];
    this.data = data;
    this.totalWeight = null;
    this.parent = null;
  }

  add_child(child: SelectionNode<ReturnType, StorageType>) {
    this.children.push(child);
    this.cumWeights.push(this.getSumOfChildWeights() + child.getWeight());
    child.parent = this;
    this.totalWeight = this.computeWeight();
    this.parent?.computeAndSetWeights();
  }

  isLeaf(): boolean {
    return this.children.length === 0;
  }

  getWeight(): number {
    if (this.totalWeight === null) {
      this.totalWeight = this.computeWeight();
    }
    return this.totalWeight;
  }

  getSumOfChildWeights(): number {
    if (this.isLeaf()) {
      return 0;
    }
    if (this.cumWeights.length === 0) {
      this.computeAndSetWeights();
    }
    return this.cumWeights[this.cumWeights.length - 1];
  }

  computeAndSetWeights() {
    let cumulativeWeight = 0;
    this.cumWeights = [];
    for (let i = 0; i < this.children.length; i++) {
      cumulativeWeight += this.children[i].getWeight();
      this.cumWeights.push(cumulativeWeight);
    }
    this.totalWeight = this.computeWeight();
    this.parent?.computeAndSetWeights();
  }

  getSomethingAtRandom(): ReturnType {
    if (this.isLeaf()) {
      return this.getSomethingUsingSnippet(null, null);
    }
    if (!this.children.length || !this.cumWeights.length) {
      const missingItem = !this.children.length
        ? "child nodes"
        : "cumulative weights";
      throw new Error(`Error: array of ${missingItem} is empty.`);
    }
    if (this.children.length !== this.cumWeights.length) {
      throw new Error(
        "Error: number of child nodes does not match number of weights."
      );
    }
    const weightedIndex = Math.random() * this.getSumOfChildWeights();
    for (let i = 0; i < this.children.length; i++) {
      if (this.cumWeights[i] > weightedIndex) {
        const outputFromChild = this.children[i].getSomethingAtRandom();
        return this.getSomethingUsingSnippet(outputFromChild, i);
      }
    }
    // If you're still here, throw an error.
    throw new Error(
      "Error: no child node selected. Please ensure that the weights add up to the total weight stored in each node."
    );
  }

  /**
   * This should be where any use-case specific logic happens regarding the
   * search and select item sequence.
   * This function should define the base cases for when this node is a leaf,
   * as well as the recursive case for when this is not a leaf.
   */
  abstract getSomethingUsingSnippet(
    snippet: ReturnType | null,
    _childIndexUsed: number | null
  ): ReturnType;

  /**
   * This should return the weight of the node, which should be a function
   * of the number of all possible values that can be extracted from this node
   * and all its descendants.
   */
  abstract computeWeight(): number;
}

export default SelectionNode;
