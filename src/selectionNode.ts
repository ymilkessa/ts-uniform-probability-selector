import binarySearch = require("binary-search");

abstract class SelectionNode<ReturnType, StorageType> {
  children: Array<SelectionNode<any, any>>;
  data: StorageType | null;
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

  constructor(data: StorageType | null = null) {
    this.children = [];
    this.cumWeights = [];
    this.data = data;
    this.totalWeight = null;
    this.parent = null;
  }

  addChild(child: SelectionNode<any, any>) {
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

  /**
   * Comparator to be used in the binary search.
   * Return -1 if weightedIndex >= this.cumWeights[indexToCheck]
   * Return 0 if weightedIndex < this.cumWeights[indexToCheck] AND either
   *          (a) indexToCheck === 0, OR
   *          (b) weightedIndex > this.cumWeights[indexToCheck - 1]
   * Return +1 if otherwise.
   */
  private comparator(weightedIndex: number, indexToCheck: number): number {
    if (this.cumWeights[indexToCheck] <= weightedIndex) {
      return -1;
    }
    if (
      indexToCheck === 0 ||
      this.cumWeights[indexToCheck - 1] <= weightedIndex
    ) {
      return 0;
    }
    return 1;
  }

  makeRandomSelection(_args: any = undefined): ReturnType {
    if (this.isLeaf()) {
      return this.recursiveSelection(null, null, _args);
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

    // Get a random number and use binary search to find the index for the selected child node
    const weightedIndex = Math.random() * this.getSumOfChildWeights();
    const index = binarySearch(
      this.cumWeights,
      weightedIndex,
      (_mid, weightedIn, index, _array) => this.comparator(weightedIn, index!)
    );
    if (index > this.children.length || index < 0) {
      throw new Error(
        "Error: Something went wrong when picking an index for a child node"
      );
    }
    const outputFromChild = this.children[index].makeRandomSelection(_args);
    return this.recursiveSelection(outputFromChild, index, _args);
  }

  /**
   * This should be where any use-case specific logic happens regarding the
   * search and select item sequence.
   * This function should define the base cases for when this node is a leaf,
   * as well as the recursive case for when this is not a leaf.
   */
  abstract recursiveSelection(
    snippet: any,
    _childIndexUsed: number | null,
    _args: any
  ): ReturnType;

  /**
   * This should return the weight of the node, which should be a function
   * of the number of all possible values that can be extracted from this node
   * and all its descendants.
   */
  abstract computeWeight(): number;
}

export default SelectionNode;
