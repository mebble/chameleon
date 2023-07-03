import type { Component } from 'solid-js';

type Character = {
    text: string,
    group?: string,
};

const characters: Character[] = [
    { text: 't' },
    { text: 'h' },
    { text: 'i' },
    { text: 's' },
    { text: ' ' },
    { text: 'i', group: 'abc' },
    { text: 's', group: 'abc' },
    { text: ' ', group: 'abc' },
    { text: 'a', group: 'abc' },
    { text: 't', group: 'abc' },
    { text: 'l', group: 'def' },
    { text: 'a', group: 'def' },
    { text: 's', group: 'def' },
    { text: ' ' },
    { text: 'o' },
    { text: 'h' },
];

type GroupMap = Record<string, any>;

const groups: GroupMap = {
    'abc': { background: '#a5a5ff' },
    'def': { background: '#ffd054' },
};

const CharactersDisplay: Component<{ chars: Character[], groups: GroupMap }> = (props) => {
    const characters = props.chars;
    const parts = partitionBy((x) => x.group, characters)

    return <div class="text-2xl">
        {parts.map(part => {
            const style = groups[part[0].group] || {};
            return <span style={style}>{part.map(char => char.text).join('')}</span>
        })}
    </div>;
};

const App: Component = () => {
    return <div class="text-center py-20">
        <p class="text-4xl mb-2">
            <button>Hello chameleon!</button>
        </p>
        <CharactersDisplay chars={characters} groups={groups} />
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

export default App;
