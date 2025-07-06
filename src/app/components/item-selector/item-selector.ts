import { isFolder, TreeNode } from '../../models/item-selector.interface';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChevronIcon } from '../icons/chevron.icon';

@Component({
  selector: 'app-item-selector',
  standalone: true,
  imports: [CommonModule, ChevronIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'item-selector.html',
})
export class ItemSelector {
  nodes = input.required<TreeNode[]>();
  nodeClick = output<string>();
  toggleExpand = output<string>();

  isFolder = isFolder;

  onNodeClick(event: Event, node: TreeNode): void {
    event.stopPropagation();
    this.nodeClick.emit(`${node.type}-${node.id}`);
  }

  onToggleExpand(event: Event, id: number): void {
    event.stopPropagation();
    this.toggleExpand.emit(`folder-${id}`);
  }
}
