export interface BaseNode {
  id: number;
  title: string;
  selected: boolean;
}

export interface FolderNode extends BaseNode {
  type: 'folder';
  parent_id: number | null;
  children: TreeNode[];
  expanded: boolean;
  indeterminate: boolean;
}

export interface ItemNode extends BaseNode {
  type: 'item';
  folder_id: number;
}

export type TreeNode = FolderNode | ItemNode;

export const isFolder = (node: TreeNode): node is FolderNode =>
  node.type === 'folder';

export interface ItemSelectorState {
  nodes: TreeNode[];
  loading: boolean;
  error: string | null;
}

export interface ApiResponse {
  folders: {
    columns: string[];
    data: [number, string, number | null][];
  };
  items: {
    columns: string[];
    data: [number, string, number][];
  };
}
