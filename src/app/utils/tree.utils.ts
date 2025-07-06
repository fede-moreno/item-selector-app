import {
  TreeNode,
  FolderNode,
  isFolder,
} from '../models/item-selector.interface';

export const toggleNodeSelection = (node: TreeNode): TreeNode => ({
  ...node,
  selected: !node.selected,
});

export const setNodeSelection = (
  node: TreeNode,
  selected: boolean,
): TreeNode => ({
  ...node,
  selected,
});

export const toggleFolderExpansion = (folder: FolderNode): FolderNode => ({
  ...folder,
  expanded: !folder.expanded,
});

export const setFolderSelection = (
  folder: FolderNode,
  selected: boolean,
): FolderNode => ({
  ...folder,
  selected,
  indeterminate: false,
  children: folder.children.map((child) =>
    isFolder(child)
      ? setFolderSelection(child, selected)
      : setNodeSelection(child, selected),
  ),
});

export const updateFolderState = (folder: FolderNode): FolderNode => {
  const updatedChildren = folder.children.map((child) =>
    isFolder(child) ? updateFolderState(child) : child,
  );

  if (updatedChildren.length === 0) {
    return { ...folder, children: updatedChildren, indeterminate: false };
  }

  const items = updatedChildren.filter((child) => !isFolder(child));
  const childFolders = updatedChildren.filter(isFolder) as FolderNode[];

  const allItemsSelected = items.every((item) => item.selected);
  const someItemsSelected = items.some((item) => item.selected);

  const allChildFoldersSelected = childFolders.every(
    (folder) => folder.selected,
  );
  const someChildFoldersSelected = childFolders.some(
    (folder) => folder.selected || folder.indeterminate,
  );

  const allSelected = allItemsSelected && allChildFoldersSelected;
  const someSelected = someItemsSelected || someChildFoldersSelected;

  return {
    ...folder,
    children: updatedChildren,
    selected: allSelected,
    indeterminate: !allSelected && someSelected,
  };
};

export const updateNodeInTree = (
  nodes: TreeNode[],
  nodeId: number,
  updateFn: (node: TreeNode) => TreeNode,
  type: 'folder' | 'item',
): TreeNode[] => {
  return nodes.map((node) => {
    if (node.id === nodeId && node.type === type) {
      return updateFn(node);
    }

    if (isFolder(node) && node.children.length > 0) {
      return {
        ...node,
        children: updateNodeInTree(node.children, nodeId, updateFn, type),
      };
    }

    return node;
  });
};

export const updateAllParents = (nodes: TreeNode[]): TreeNode[] => {
  return nodes.map((node) => (isFolder(node) ? updateFolderState(node) : node));
};

export const updateTreeWithParents = (
  nodes: TreeNode[],
  nodeId: number,
  updateFn: (node: TreeNode) => TreeNode,
  type: 'folder' | 'item',
): TreeNode[] => {
  const updated = updateNodeInTree(nodes, nodeId, updateFn, type);
  return updateAllParents(updated);
};

export const parseUuid = (
  uuid: string,
): { type: 'folder' | 'item'; id: number } => {
  const [type, idStr] = uuid.split('-');
  return {
    type: type as 'folder' | 'item',
    id: parseInt(idStr),
  };
};

export const collectSelectedIds = (nodes: TreeNode[]): number[] => {
  const ids: number[] = [];

  const collect = (nodeList: TreeNode[]) => {
    for (const node of nodeList) {
      if (node.selected && node.type === 'item') {
        ids.push(node.id);
      }
      if (isFolder(node)) {
        collect(node.children);
      }
    }
  };

  collect(nodes);
  return ids;
};

export const clearAllSelections = (nodes: TreeNode[]): TreeNode[] => {
  return nodes.map((node) => {
    if (isFolder(node)) {
      return {
        ...node,
        selected: false,
        indeterminate: false,
        children: clearAllSelections(node.children),
      };
    }
    return {
      ...node,
      selected: false,
    };
  });
};

export const findNode = (
  nodes: TreeNode[],
  id: number,
  type: 'folder' | 'item',
): TreeNode | null => {
  for (const node of nodes) {
    if (node.id === id && node.type === type) {
      return node;
    }

    if (isFolder(node)) {
      const found = findNode(node.children, id, type);
      if (found) return found;
    }
  }
  return null;
};
