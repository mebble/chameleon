import { zip } from 'lodash'

export function selectionIndexes(selection: Selection, container: Element): [number, number] {
    const selectionString = selection.toString();
    const selectionLength = selectionString.length;
    const regex = new RegExp(selectionString, 'g');

    const matches = Array.from(container.textContent!.matchAll(regex)!);
    const matchingNodes = nodes(container)
        .filter(n => n.textContent?.includes(selectionString))
        .flatMap(n => {
            const numMatches = (n.textContent?.match(regex) || []).length;
            return Array<Node>(numMatches).fill(n);
        })
    const zipped = zip(matches, matchingNodes)
    const filtered = zipped.filter(([_match, node]) => {
        return (node === selection.anchorNode) && (node === selection.focusNode);
    }) 
    const [match,] = filtered.length === 1
        ? filtered[0]
        : filtered.find(([match, _node]) => {
            return selection.anchorOffset == match.index!
        });

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
