import { zip, dropWhile } from 'lodash'

export function selectionIndexes(selection: Selection, container: Element): [number, number] {
    const selectionString = selection.toString();
    const selectionLength = selectionString.length;

    const matches = Array.from(container.textContent!.matchAll(new RegExp(selectionString, 'g'))!);
    const matchingNodes = nodes(container).filter(n => n.textContent?.includes(selectionString))
    const zipped = zip(matches, matchingNodes)

    const [_match,] = dropWhile(zipped, ([_match, node]) => {
        return !(node === selection.anchorNode) || !(node === selection.focusNode);
    })[0]

    const match = _match!;
    const start = match.index!
    return [start, start + selectionLength]
}

function nodes(container: Element): Node[] {
    const result: Node[] = [];
    let i = document.createNodeIterator(container, NodeFilter.SHOW_TEXT)
    for (let node = i.nextNode(); node; node = i.nextNode()) {
        result.push(node);
    }
    return result;
}
