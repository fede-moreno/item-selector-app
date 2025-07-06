import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  ApiResponse,
  TreeNode,
  FolderNode,
  ItemNode,
} from '../models/item-selector.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http = inject(HttpClient);

  public getFolderTree(): Observable<TreeNode[]> {
    return this.http.get<ApiResponse>('/assets/response.json').pipe(
      map((response) => this.buildTree(response)),
      catchError(this.handleError),
    );
  }

  private buildTree(response: ApiResponse): TreeNode[] {
    const foldersMap = new Map<number, FolderNode>();

    response.folders.data.forEach(([id, title, parent_id]) => {
      foldersMap.set(id, {
        id,
        title,
        type: 'folder',
        parent_id,
        children: [],
        expanded: true,
        selected: false,
        indeterminate: false,
      });
    });

    const items: ItemNode[] = response.items.data.map(
      ([id, title, folder_id]) => ({
        id,
        title,
        type: 'item',
        folder_id,
        selected: false,
      }),
    );

    items.forEach((item) => {
      const folder = foldersMap.get(item.folder_id);
      if (folder) {
        folder.children.push(item);
      }
    });

    const roots: TreeNode[] = [];

    foldersMap.forEach((folder) => {
      if (folder.parent_id === null) {
        roots.push(folder);
      } else {
        const parent = foldersMap.get(folder.parent_id);
        if (parent) {
          parent.children.push(folder);
        }
      }
    });

    this.sortNodes(roots);

    return roots;
  }

  // sorts by type (folders first) then by title
  private sortNodes(nodes: TreeNode[]): void {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.title.localeCompare(b.title);
    });

    nodes.forEach((node) => {
      if (node.type === 'folder' && node.children.length > 0) {
        this.sortNodes(node.children);
      }
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = 'Error fetching folders and items';

    console.error(message, error);
    return throwError(() => new Error(message));
  }
}
