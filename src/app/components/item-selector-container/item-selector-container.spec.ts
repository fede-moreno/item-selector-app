import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ItemSelectorContainer } from './item-selector-container';
import { ItemSelectorStore } from '../../store/item-selector.store';
import { DataService } from '../../services/data.service';

describe('ItemSelectorContainer', () => {
  let spectator: Spectator<ItemSelectorContainer>;
  const createComponent = createComponentFactory({
    component: ItemSelectorContainer,
    providers: [
      ItemSelectorStore,
      mockProvider(DataService, {
        getFolderTree: jest.fn(() => of([])),
      }),
      provideHttpClientTesting(),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render the ItemSelector', () => {
    expect(spectator.query('app-item-selector')).toBeTruthy();
  });

  it('ngOnInit should loadData', () => {
    const spy = jest.spyOn(spectator.component['store'], 'loadData');
    spectator.component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
});
