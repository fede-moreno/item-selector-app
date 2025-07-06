import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ItemSelector } from './item-selector';
import { mockTree } from '../../models/item-selector.mocks';

describe('ItemSelector', () => {
  let spectator: Spectator<ItemSelector>;
  const createComponent = createComponentFactory({
    component: ItemSelector,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        nodes: mockTree,
      },
    });
  });

  it('should render the nodes', () => {
    expect(spectator.queryAll('div[role="treeitem"]').length).toBe(
      13, // Sum of folders and items
    );
  });
});
