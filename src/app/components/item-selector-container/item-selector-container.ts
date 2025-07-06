import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemSelectorStore } from '../../store/item-selector.store';
import { ItemSelector } from '../item-selector/item-selector';

@Component({
  selector: 'app-item-selector-container',
  standalone: true,
  imports: [CommonModule, ItemSelector],
  templateUrl: './item-selector-container.html',
})
export class ItemSelectorContainer implements OnInit {
  protected readonly store = inject(ItemSelectorStore);

  ngOnInit(): void {
    this.store.loadData();
  }
}
