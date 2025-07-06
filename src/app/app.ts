import { Component } from '@angular/core';
import { ItemSelectorContainer } from './components/item-selector-container/item-selector-container';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ItemSelectorContainer],
  templateUrl: 'app.html',
})
export class App {}
