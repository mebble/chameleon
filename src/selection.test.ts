/**
 * @vitest-environment jsdom
 */

import { test, expect } from 'vitest';
import userEvent from '@testing-library/user-event'
import { selectionIndexes } from './selection';

function setup(html: string) {
    document.body.replaceChildren();
    document.getSelection()?.removeAllRanges()
    const user = userEvent.setup();
    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.append(div);
    return {
        user,
        element: div
    };
}

async function highlight(user: any, el: Element, from: number, to: number): Promise<void> {
    await user.pointer([{
        target: el,
        offset: from,
        keys: '[MouseLeft>]'
    }, {
        offset: to,
    }])
}

test('one match single span', async () => {
    const { user, element } = setup('<span>xxxxxxxabcxxxx</span>');
    await highlight(user, element, 7, 10)

    const selection = document.getSelection()!;
    const indexes = selectionIndexes(selection, element);

    expect(selection.toString()).toEqual('abc')
    expect(indexes).toEqual([7, 10])
})

test('one match in nested span', async () => {
    const { user, element } = setup('<span>xxxxx<span>xxabcx</span>xxx</span>');
    await highlight(user, element, 7, 10)

    const selection = document.getSelection()!;
    const indexes = selectionIndexes(selection, element);

    expect(selection.toString()).toEqual('abc')
    expect(indexes).toEqual([7, 10])
})

test('multiple matches in nested span', async () => {
    const { user, element } = setup('<span>xxabcxx<span>**abc*</span>xxx</span>');
    await highlight(user, element, 9, 12)

    const selection = document.getSelection()!;
    const indexes = selectionIndexes(selection, element);

    expect(selection.toString()).toEqual('abc')
    expect(indexes).toEqual([9, 12])
})

test('multiple matches in nested span', async () => {
    const { user, element } = setup('<span>xxabcxx<span>**abc*</span>xxx</span>');
    await highlight(user, element, 2, 5)

    const selection = document.getSelection()!;
    const indexes = selectionIndexes(selection, element);

    expect(selection.toString()).toEqual('abc')
    expect(indexes).toEqual([2, 5])
})

test('multiple matches in single span', async () => {
    const { user, element } = setup('<span>xabcxxxxxxabcxxxx</span>');
    await highlight(user, element, 1, 4)

    const selection = document.getSelection()!;
    const indexes = selectionIndexes(selection, element);

    expect(selection.toString()).toEqual('abc')
    expect(indexes).toEqual([1, 4])
})

test('multiple matches in single span', async () => {
    const { user, element } = setup('<span>xabcxxxxxxabcxxxx</span>');
    await highlight(user, element, 10, 13)

    const selection = document.getSelection()!;
    const indexes = selectionIndexes(selection, element);

    expect(selection.toString()).toEqual('abc')
    expect(indexes).toEqual([10, 13])
})
