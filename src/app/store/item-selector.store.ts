import { Injectable, computed, inject, signal } from '@angular/core';
import {
  TreeNode,
  FolderNode,
  isFolder,
  ItemSelectorState,
} from '../models/item-selector.interface';
import { DataService } from '../services/data.service';
import {
  toggleNodeSelection,
  setFolderSelection,
  toggleFolderExpansion,
  updateTreeWithParents,
  updateNodeInTree,
  collectSelectedIds,
  clearAllSelections,
  findNode,
  parseUuid,
} from '../utils/tree.utils';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemSelectorStore {
  private readonly dataService = inject(DataService);

  private readonly state = signal<ItemSelectorState>({
    nodes: [],
    loading: false,
    error: null,
  });

  readonly nodes = computed(() => this.state().nodes);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly selectedIds = computed(() => collectSelectedIds(this.state().nodes));
  readonly hasSelection = computed(() => this.selectedIds().length > 0);

  public loadData(): void {
    this.updateState({ loading: true, error: null });

    this.dataService
      .getFolderTree()
      .pipe(take(1))
      .subscribe({
        next: (nodes) => {
          this.updateState({ nodes, loading: false });
        },
        error: (error) => {
          this.updateState({
            error: error.message || 'Failed to load data',
            loading: false,
          });
        },
      });
  }

  public toggleSelection(uuid: string): void {
    const { type, id } = parseUuid(uuid);

    const node = findNode(this.state().nodes, id, type);
    if (!node) return;

    const updateFn = isFolder(node)
      ? (n: TreeNode) =>
          setFolderSelection(
            n as FolderNode,
            node.indeterminate || !node.selected,
          )
      : toggleNodeSelection;

    const updatedNodes = updateTreeWithParents(
      this.state().nodes,
      id,
      updateFn,
      type,
    );
    this.updateState({ nodes: updatedNodes });
  }

  public toggleExpansion(uuid: string): void {
    const { id } = parseUuid(uuid);
    const expansionFn = (node: TreeNode) =>
      isFolder(node) ? toggleFolderExpansion(node) : node;

    const updatedNodes = updateNodeInTree(
      this.state().nodes,
      id,
      expansionFn,
      'folder',
    );

    this.updateState({ nodes: updatedNodes });
  }

  public clearSelection(): void {
    const clearedNodes = clearAllSelections(this.state().nodes); // Could be simplified with an initialState
    this.updateState({ nodes: clearedNodes });
  }

  private updateState(partial: Partial<ItemSelectorState>): void {
    this.state.update((state) => ({ ...state, ...partial }));
  }
}
