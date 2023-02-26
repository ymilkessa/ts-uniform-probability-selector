# Uniform Probability Selector

Module for making equally random selections of items that are arranged in a tree structure. It contains two classes described blow. (TODO: ADD SOME LINK HERE)

## Classes

#### `SelectionNode`

Abstract class that contains logic for uniformly random selection

Here is a stupid but simple example. Suppose that we are storing the names of students separately in categories. We want a data structure that would allow us to select any one student at random.

```typescript
import { SelectionNode } from "uniform-probability-selector";

class StudentSelector extends SelectionNode<string, Array<string>> {
  /**
   * Define your recusive selection logic here.
   *    Arguments:
   *        snippet: Data returned from a child node (or null if this is a leaf node)
   *        childIndexUsed: Index of the child node from which the snippet was returned. (null if this is a leaf node)
   *
   *    Returns whatever value that you want this node to return
   */
  recursiveSelection(snippet: string, _childIndexUsed: number): string {
    /**
     * Case n=1
     * If snippet is null, then this is a leaf node.
     * So just return the value of that you want a leaf to generate.
     * In this example, we want to return a randomly selected students' name.
     */
    if (snippet === null) {
      const randomIndex = Math.floor(Math.random() * this.data!.length);
      return this.data![randomIndex];
    }

    /**
     * Case n>1: snippet is output from n-1th step.
     * If this is not a leaf node, do whatever function you want the intermediary
     * nodes to do with the given snippet.
     * In this example, the intermediary node simply returns the snippet as is.
     */
    return snippet;
  }

  /**
   * Set how you want the weights of your nodes to be computed.
   * To achieve a uniform distribution, you should make the weight of a node to be the number
   * unique values that can be generated from it (and its descendants).
   *
   * Returns a number.
   */
  computeWeight(): number {
    // If this is a leaf, just return the number of names.
    if (this.isLeaf()) {
      return this.data!.length;
    }
    // Otherwise, just add up the weights of all the child nodes.
    return this.getSumOfChildWeights();
  }
}

const artStudents = new StudentSelector(["joe", "jill"]);
const musicStudents = new StudentSelector(["albert", "alice", "alex"]);
const allStudents = new StudentSelector();
allStudents.addChild(artStudents);
allStudents.addChild(musicStudents);

// Get any one of the art students at random
console.log(`${artStudents.makeRandomSelection()} does art`);

// Get any one of the music students at random
console.log(`${musicStudents.makeRandomSelection()} does music`);

// Make a uniformly random selection from all students
console.log(`${allStudents.makeRandomSelection()} is a student`);

// Print number of students under any node
console.log("Number of music students", musicStudents.getWeight()); // 3
console.log("Total number of students", allStudents.getWeight()); // 5
```

#### `TextBuilderNode`

Implementation of SelectionNode for constructing texts out of substrings.

Here is a simple example that generates a dialogue.

```typescript
import { TextBuilderNode } from "uniform-probability-selector";

const theLover = new TextBuilderNode([
  "Do you... do you love me?\n",
  "I love you. Do you feel the same?\n",
  "You love me, right?\n",
  "Please, tell me you love me.\n",
]);

const theFriendZoner = new TextBuilderNode([
  "No, I don't love you.",
  "Hell no.",
  "In year dreams, maybe.",
  "Of course I like you.",
  "I don't see you that way.",
  "You're... you're a good friend.",
]);

theLover.addChild(theFriendZoner);

// Print a randomly selected dialogue
console.log(theLover.makeRandomSelection());
// "Do you... do you love me?"
//   "Hell no."
```
