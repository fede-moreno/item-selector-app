import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { App } from './app';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ItemSelectorStore } from './store/item-selector.store';
import { DataService } from './services/data.service';
import { of } from 'rxjs';

describe('App', () => {
  let spectator: Spectator<App>;
  const createComponent = createComponentFactory({
    component: App,
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

  it('should create the app component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render the ItemSelectorContainer', () => {
    expect(spectator.query('app-item-selector-container')).toBeTruthy();
  });
});
