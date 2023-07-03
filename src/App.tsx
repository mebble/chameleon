import type { Component } from 'solid-js';
import { createSignal, For } from 'solid-js';
import { selectionIndexes } from './selection';

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

type Character = {
    text: string;
    group?: string;
};
type GroupMap = Record<string, any>;
type Text = {
    characters: Character[];
    groups: GroupMap;
}

const CharactersDisplay: Component<{ text: Text, ref: any }> = (props) => {
    return <div class="text-2xl" ref={props.ref}>
        <For each={partitionBy(x => x.group, props.text.characters)}>{(part) => {
            const style = props.text.groups[part[0].group] || {};
            return <span style={style}>{part.map(char => char.text).join('')}</span>
        }}</For>
    </div>;
};

const App: Component = () => {
    const [color, setColor] = createSignal('#f6b73c');
    const [text, setText] = createSignal<Text>({ characters: generate(lorem), groups: {} });
    let ref;

    const handleHighlight = _event => {
        const selection = document.getSelection();
        const [start, end] = selectionIndexes(selection, ref)
        
        const newGroupId = randomStr();
        const t = text();
        const characters = t.characters
        const newChars = [
            ...characters.slice(0, start),
            ...characters.slice(start, end).map(c => ({ ...c, group: newGroupId })),
            ...characters.slice(end)
        ];
        setText({
            characters: newChars,
            groups: {
                ...t.groups,
                [newGroupId]: { background: color() }
            }
        })
    };

    return <div class="text-center py-20">
        <header class="text-4xl mb-2">
            <h1>Hello chameleon!</h1>
        </header>
        <CharactersDisplay text={text()} ref={ref} />
        <div class="inline-flex mt-2 gap-3">
            <input type="color" value={color()} onInput={e => setColor(e.target.value)} />
            <button onClick={handleHighlight} class="bg-gray-500 text-neutral-100 rounded px-1">Highlight</button>
        </div>
    </div>;
};

function partitionBy<T> (accessor: (x: T) => any, arr: T[]): T[][] {
    const partitions: T[][] = [];
    for (const x of arr) {
        if (partitions.length === 0) {
            partitions.push([x]);
            continue;
        }
        const lastPartition = partitions[partitions.length - 1];
        const lastItem = lastPartition[lastPartition.length - 1];
        if (accessor(x) === accessor(lastItem)) {
            lastPartition.push(x);
        } else {
            partitions.push([x])
        }
    }
    return partitions;
}

function generate(text: string): Character[] {
    return text.split('').map(c => ({ text: c }));
}

function randomStr(): string {
    return Math.random().toString(36).substring(2, 5);
}

export default App;
