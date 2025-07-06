import {
  toggleNodeSelection,
  setFolderSelection,
  updateFolderState,
  updateNodeInTree,
  parseUuid,
  collectSelectedIds,
  clearAllSelections,
  findNode,
} from './tree.utils';
import {
  TreeNode,
  FolderNode,
  ItemNode,
} from '../models/item-selector.interface';

describe('TreeUtils', () => {
  const createMockTree = (): TreeNode[] => [
    {
      id: 1,
      title: 'Audio',
      type: 'folder',
      parent_id: null,
      expanded: true,
      selected: false,
      indeterminate: false,
      children: [
        {
          id: 4,
          title: 'Speakers',
          type: 'folder',
          parent_id: 1,
          expanded: true,
          selected: false,
          indeterminate: false,
          children: [
            {
              id: 7,
              title: 'Speaker item 1',
              type: 'item',
              folder_id: 4,
              selected: false,
            },
            {
              id: 8,
              title: 'Speaker item 2',
              type: 'item',
              folder_id: 4,
              selected: false,
            },
          ],
        },
        {
          id: 5,
          title: 'Audio item 1',
          type: 'item',
          folder_id: 1,
          selected: false,
        },
        { id: 1, title: 'Item 1', type: 'item', folder_id: 1, selected: false },
      ],
    } as FolderNode,
  ];

  describe('toggleNodeSelection', () => {
    it('should toggle node selection immutably', () => {
      const item: ItemNode = {
        id: 1,
        title: 'Item',
        type: 'item',
        folder_id: 1,
        selected: false,
      };
      const toggled = toggleNodeSelection(item);

      expect(toggled.selected).toBe(true);
      expect(toggled).not.toBe(item);
      expect(item.selected).toBe(false); // Original unchanged
    });
  });

  describe('setFolderSelection', () => {
    it('should recursively set selection for folder and all children', () => {
      const tree = createMockTree();
      const folder = tree[0] as FolderNode;

      const updated = setFolderSelection(folder, true);

      expect(updated.selected).toBe(true);
      expect(updated.indeterminate).toBe(false);

      // Check nested folder
      const speakersFolder = updated.children[0] as FolderNode;
      expect(speakersFolder.selected).toBe(true);

      // Check all items
      expect(speakersFolder.children.every((child) => child.selected)).toBe(
        true,
      );
      expect(updated.children[1].selected).toBe(true);
    });
  });

  describe('updateFolderState', () => {
    it('should set folder to selected when all children are selected', () => {
      const folder: FolderNode = {
        id: 1,
        title: 'Folder',
        type: 'folder',
        parent_id: null,
        expanded: true,
        selected: false,
        indeterminate: false,
        children: [
          {
            id: 2,
            title: 'Item 1',
            type: 'item',
            folder_id: 1,
            selected: true,
          },
          {
            id: 3,
            title: 'Item 2',
            type: 'item',
            folder_id: 1,
            selected: true,
          },
        ],
      };

      const updated = updateFolderState(folder);

      expect(updated.selected).toBe(true);
      expect(updated.indeterminate).toBe(false);
    });

    it('should set folder to indeterminate when some children are selected', () => {
      const folder: FolderNode = {
        id: 1,
        title: 'Folder',
        type: 'folder',
        parent_id: null,
        expanded: true,
        selected: false,
        indeterminate: false,
        children: [
          {
            id: 2,
            title: 'Item 1',
            type: 'item',
            folder_id: 1,
            selected: true,
          },
          {
            id: 3,
            title: 'Item 2',
            type: 'item',
            folder_id: 1,
            selected: false,
          },
        ],
      };

      const updated = updateFolderState(folder);

      expect(updated.selected).toBe(false);
      expect(updated.indeterminate).toBe(true);
    });

    it('should handle nested folders correctly', () => {
      const tree = createMockTree();
      const audioFolder = tree[0] as FolderNode;

      // Select only one item in Speakers folder
      (audioFolder.children[0] as FolderNode).children[0].selected = true;

      const updated = updateFolderState(audioFolder);

      // Speakers should be indeterminate
      const speakers = updated.children[0] as FolderNode;
      expect(speakers.indeterminate).toBe(true);

      // Audio should also be indeterminate
      expect(updated.indeterminate).toBe(true);
    });
  });

  describe('updateNodeInTree', () => {
    it('should update specific node by id and type', () => {
      const tree = createMockTree();

      const updated = updateNodeInTree(
        tree,
        7,
        (node) => ({ ...node, selected: true }),
        'item',
      );

      const item = ((updated[0] as FolderNode).children[0] as FolderNode)
        .children[0];
      expect(item.selected).toBe(true);
    });

    it('should not update nodes with wrong type', () => {
      const tree = createMockTree();

      // Try to update folder with id 1 as an item (should not work)
      const updated = updateNodeInTree(
        tree,
        1,
        (node) => ({ ...node, selected: true }),
        'item',
      );

      expect(updated[0].selected).toBe(false);
    });
  });

  describe('parseUuid', () => {
    it('should parse composite id correctly', () => {
      expect(parseUuid('folder-10')).toEqual({ type: 'folder', id: 10 });
      expect(parseUuid('item-5')).toEqual({ type: 'item', id: 5 });
    });
  });

  describe('collectSelectedIds', () => {
    it('should collect only selected item IDs', () => {
      const tree = createMockTree();
      const audioFolder = tree[0] as FolderNode;

      // Select some items
      (audioFolder.children[0] as FolderNode).children[0].selected = true; // Speaker item 1
      audioFolder.children[1].selected = true; // Audio item 1

      const ids = collectSelectedIds(tree);

      expect(ids).toEqual([7, 5]);
      expect(ids.length).toBe(2);
    });

    it('should not include folder IDs', () => {
      const tree = createMockTree();
      (tree[0] as FolderNode).selected = true;

      const ids = collectSelectedIds(tree);

      expect(ids).toEqual([]);
    });
  });

  describe('clearAllSelections', () => {
    it('should clear all selections recursively', () => {
      const tree = createMockTree();
      const audioFolder = tree[0] as FolderNode;

      // Select everything
      audioFolder.selected = true;
      audioFolder.indeterminate = true;
      audioFolder.children.forEach((child) => {
        child.selected = true;
        if ('children' in child) {
          child.children.forEach((c) => (c.selected = true));
        }
      });

      const cleared = clearAllSelections(tree);

      // Check everything is cleared
      expect(cleared[0].selected).toBe(false);
      expect((cleared[0] as FolderNode).indeterminate).toBe(false);

      const checkAllUnselected = (nodes: TreeNode[]): boolean => {
        return nodes.every((node) => {
          if (!node.selected && 'children' in node) {
            return checkAllUnselected(node.children);
          }
          return !node.selected;
        });
      };

      expect(checkAllUnselected(cleared)).toBe(true);
    });
  });

  describe('findNode', () => {
    it('should find node by id and type', () => {
      const tree = createMockTree();

      const item = findNode(tree, 7, 'item');
      expect(item).toBeDefined();
      expect(item?.title).toBe('Speaker item 1');

      const folder = findNode(tree, 4, 'folder');
      expect(folder).toBeDefined();
      expect(folder?.title).toBe('Speakers');
    });

    it('should return null for non-existent node', () => {
      const tree = createMockTree();

      expect(findNode(tree, 999, 'item')).toBeNull();
    });

    it('should handle duplicate ids with different types', () => {
      const tree = createMockTree();

      const folder = findNode(tree, 1, 'folder');
      const item = findNode(tree, 1, 'item');

      expect(folder?.type).toBe('folder');
      expect(folder?.title).toBe('Audio');
      expect(item?.type).toBe('item');
      expect(item?.title).toBe('Item 1');
    });
  });
});
