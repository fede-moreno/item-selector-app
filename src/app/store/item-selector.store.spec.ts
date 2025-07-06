import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ItemSelectorStore } from './item-selector.store';
import { DataService } from '../services/data.service';
import { of, throwError } from 'rxjs';
import { FolderNode } from '../models/item-selector.interface';
import { mockTree } from '../models/item-selector.mocks';

describe('ItemSelectorStore', () => {
  let spectator: SpectatorService<ItemSelectorStore>;
  let store: ItemSelectorStore;

  const createService = createServiceFactory({
    service: ItemSelectorStore,
    mocks: [DataService],
  });

  beforeEach(() => {
    spectator = createService();
    store = spectator.service;
  });

  it('should load data and update state on success', () => {
    const dataService = spectator.inject(DataService);
    dataService.getFolderTree.mockReturnValue(of(mockTree));

    store.loadData();

    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.nodes()).toEqual(mockTree);
  });

  it('should handle error on loadData failure', () => {
    const dataService = spectator.inject(DataService);
    dataService.getFolderTree.mockReturnValue(
      throwError(() => new Error('Network error')),
    );

    store.loadData();

    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('Network error');
  });

  it('should toggle selection of an item node', () => {
    const itemNodeUuid = 'item-1';
    store['state'].set({ nodes: mockTree, loading: false, error: null });

    const prevSelected = store.selectedIds();
    store.toggleSelection(itemNodeUuid);
    const nextSelected = store.selectedIds();

    expect(prevSelected).not.toEqual(nextSelected);
  });

  it('should toggle expansion of a folder node', () => {
    const folderUuid = 'folder-1';
    store['state'].set({ nodes: mockTree, loading: false, error: null });

    const before = (store.nodes().find((n) => n.id === 1) as FolderNode)
      .expanded;
    store.toggleExpansion(folderUuid);
    const after = (store.nodes().find((n) => n.id === 1) as FolderNode)
      .expanded;

    expect(before).not.toEqual(after);
  });
});
