export type Doc = Nil | Text | Line | Nest | Concat | Union;

export interface Nil {
  type: "Nil";
}

export interface Text {
  type: "Text";
  text: string;
}

export interface Line {
  type: "Line";
  reducedText: string;
}

export interface Nest {
  type: "Nest";
  indent: number;
  doc: Doc;
}

export interface Concat {
  type: "Concat";
  docs: Doc[];
}

export interface Union {
  type: "Union";
  a: () => Doc;
  b: () => Doc;
}

type LayoutDoc = TextLayoutDoc | LineLayoutDoc | NilLayoutDoc;

interface TextLayoutDoc {
  type: "Text";
  text: string;
  next: () => LayoutDoc;
}

interface LineLayoutDoc {
  type: "Line";
  text: string;
  next: () => LayoutDoc;
}

interface NilLayoutDoc {
  type: "Nil";
}

type DocumentPair = [number, Doc];

// Take in a function and wrap it so that the function is cached
// on first invocation and returns results instantly thereafter.
function lazy<T>(closure: () => T): () => T {
  let cached: T | null = null;
  return () => (cached == null ? (cached = closure()) : cached);
}

function fits(remainingWidth: number, layoutDoc: LayoutDoc): boolean {
  if (remainingWidth < 0) return false;
  if (layoutDoc.type == "Text") {
    return fits(remainingWidth - layoutDoc.text.length, layoutDoc.next());
  }
  // If the layout is of type `line` or `nil` it always fits.
  return true;
}

function best(
  maxLineWidth: number,
  lineWidth: number,
  documentPairs: DocumentPair[]
): LayoutDoc {
  if (documentPairs.length == 0) return { type: "Nil" }; // end of layout chain

  // Grab current indentation level and document from head of list
  const [indent, doc] = documentPairs[0];
  const nextDocs = documentPairs.slice(1);
  // Convenience function to recurse
  const _best = (newDocs: DocumentPair[] = [], lw = lineWidth): LayoutDoc => {
    return best(maxLineWidth, lw, newDocs.concat(nextDocs));
  };

  switch (doc.type) {
    case "Nil":
      return _best();
    case "Concat":
      return _best(doc.docs.map((doc) => [indent, doc]));
    case "Nest":
      return _best([[indent + doc.indent, doc.doc]]);
    case "Union": {
      // See if first doc in union fits; if not, use second
      const doc1 = _best([[indent, doc.a()]]);
      if (fits(maxLineWidth - lineWidth, doc1)) return doc1;
      return _best([[indent, doc.b()]]);
    }

    // Text and lines output layout chains
    case "Text": {
      const newLineWidth = lineWidth + doc.text.length;
      return {
        type: "Text",
        text: doc.text,
        next: lazy(() => _best([], newLineWidth)),
      };
    }
    case "Line": {
      return {
        type: "Line",
        text: `\n${" ".repeat(indent)}`,
        next: lazy(() => _best([], indent)),
      };
    }
  }
}

function unravelLayout(layoutDoc: LayoutDoc): string[] {
  const results: string[] = [];
  while (layoutDoc.type != "Nil") {
    if (layoutDoc.type === "Text") {
      results.push(layoutDoc.text);
    } else {
      results.push(layoutDoc.text);
    }
    layoutDoc = layoutDoc.next();
  }
  return results;
}

function flatten(doc: Doc): Doc {
  // Flatten always picks the first option in a union
  while (doc.type == "Union") doc = doc.a();

  if (doc.type == "Concat")
    return { type: "Concat", docs: doc.docs.map(flatten) };
  if (doc.type == "Nest")
    return { type: "Nest", indent: doc.indent, doc: flatten(doc.doc) };
  // Convert lines to their reduced text
  if (doc.type == "Line")
    return {
      type: "Text",
      text: doc.reducedText,
    };

  // If doc is text or nil, it's unchanged
  return doc;
}

function group(doc: Doc): Doc {
  // Unions are evaluated lazily
  return { type: "Union", a: lazy(() => flatten(doc)), b: lazy(() => doc) };
}
