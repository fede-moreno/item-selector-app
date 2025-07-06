import { ApiResponse, TreeNode } from './item-selector.interface';

export const mockApiResponse: ApiResponse = {
  folders: {
    columns: ['id', 'title', 'parent_id'],
    data: [
      [1, 'Audio', null],
      [4, 'Speakers', 1],
      [2, 'Passive speakers', 4],
      [10, 'Active speakers', 4],
      [8, 'Rigging', null],
      [6, 'Truss', 8],
    ],
  },
  items: {
    columns: ['id', 'title', 'folder_id'],
    data: [
      [3, 'Passive Speakers Item 1', 2],
      [1, 'Active Speakers Item 1', 10],
      [7, 'Speaker item 1', 4],
      [4, 'Speaker item 2', 4],
      [5, 'Audio item 1', 1],
      [6, 'Truss item 1', 6],
      [8, 'Truss item 2', 6],
    ],
  },
};

export const mockTree: TreeNode[] = [
  {
    id: 1,
    title: 'Audio',
    type: 'folder',
    parent_id: null,
    children: [
      {
        id: 4,
        title: 'Speakers',
        type: 'folder',
        parent_id: 1,
        children: [
          {
            id: 10,
            title: 'Active speakers',
            type: 'folder',
            parent_id: 4,
            children: [
              {
                id: 1,
                title: 'Active Speakers Item 1',
                type: 'item',
                folder_id: 10,
                selected: false,
              },
            ],
            expanded: true,
            selected: false,
            indeterminate: false,
          },
          {
            id: 2,
            title: 'Passive speakers',
            type: 'folder',
            parent_id: 4,
            children: [
              {
                id: 3,
                title: 'Passive Speakers Item 1',
                type: 'item',
                folder_id: 2,
                selected: false,
              },
            ],
            expanded: true,
            selected: false,
            indeterminate: false,
          },
          {
            id: 7,
            title: 'Speaker item 1',
            type: 'item',
            folder_id: 4,
            selected: false,
          },
          {
            id: 4,
            title: 'Speaker item 2',
            type: 'item',
            folder_id: 4,
            selected: false,
          },
        ],
        expanded: true,
        selected: false,
        indeterminate: false,
      },
      {
        id: 5,
        title: 'Audio item 1',
        type: 'item',
        folder_id: 1,
        selected: false,
      },
    ],
    expanded: true,
    selected: false,
    indeterminate: false,
  },
  {
    id: 8,
    title: 'Rigging',
    type: 'folder',
    parent_id: null,
    children: [
      {
        id: 6,
        title: 'Truss',
        type: 'folder',
        parent_id: 8,
        children: [
          {
            id: 6,
            title: 'Truss item 1',
            type: 'item',
            folder_id: 6,
            selected: false,
          },
          {
            id: 8,
            title: 'Truss item 2',
            type: 'item',
            folder_id: 6,
            selected: false,
          },
        ],
        expanded: true,
        selected: false,
        indeterminate: false,
      },
    ],
    expanded: true,
    selected: false,
    indeterminate: false,
  },
];
