import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';
import { DataService } from './data.service';
import { TreeNode, FolderNode } from '../models/item-selector.interface';
import { mockApiResponse, mockTree } from '../models/item-selector.mocks';

describe('DataService', () => {
  let spectator: SpectatorHttp<DataService>;
  const createHttp = createHttpFactory(DataService);

  beforeEach(() => {
    spectator = createHttp();
  });

  describe('getFolderTree', () => {
    it('should fetch and build folder tree correctly', (done) => {
      spectator.service.getFolderTree().subscribe({
        next: (data: TreeNode[]) => {
          expect(data).toBeDefined();
          expect(data.length).toBe(2);
          expect(data[0].title).toBe('Audio');
          expect(data[1].title).toBe('Rigging');
          expect(data).toStrictEqual(mockTree);
          done();
        },
      });

      const req = spectator.expectOne('/assets/response.json', HttpMethod.GET);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });

    it('should build proper parent-child relationships', (done) => {
      spectator.service.getFolderTree().subscribe({
        next: (data: TreeNode[]) => {
          const audioFolder = data[0] as FolderNode;
          expect(audioFolder.children.length).toBe(2);

          const speakersFolder = audioFolder.children.find(
            (n): n is FolderNode => n.type === 'folder',
          );
          expect(speakersFolder).toBeDefined();
          expect(speakersFolder!.title).toBe('Speakers');
          expect(speakersFolder!.children.length).toBe(4);
          done();
        },
      });

      spectator
        .expectOne('/assets/response.json', HttpMethod.GET)
        .flush(mockApiResponse);
    });

    it('should sort folders before items and alphabetically', (done) => {
      spectator.service.getFolderTree().subscribe({
        next: (data: TreeNode[]) => {
          const audioFolder = data[0] as FolderNode;
          expect(audioFolder.children[0].type).toBe('folder');
          expect(audioFolder.children[1].type).toBe('item');

          const speakersFolder = audioFolder.children[0] as FolderNode;
          const subfolders = speakersFolder.children.filter(
            (n): n is FolderNode => n.type === 'folder',
          );
          expect(subfolders[0].title).toBe('Active speakers');
          expect(subfolders[1].title).toBe('Passive speakers');
          done();
        },
      });

      spectator
        .expectOne('/assets/response.json', HttpMethod.GET)
        .flush(mockApiResponse);
    });

    it('should initialize folder properties correctly', (done) => {
      spectator.service.getFolderTree().subscribe({
        next: (data: TreeNode[]) => {
          const folder = data[0] as FolderNode;
          expect(folder.expanded).toBe(true);
          expect(folder.selected).toBe(false);
          expect(folder.indeterminate).toBe(false);
          expect(folder.type).toBe('folder');
          done();
        },
      });

      spectator
        .expectOne('/assets/response.json', HttpMethod.GET)
        .flush(mockApiResponse);
    });

    it('should handle HTTP errors', (done) => {
      const errorMessage = 'Error fetching folders and items';

      spectator.service.getFolderTree().subscribe({
        next: () => fail('Should have failed'),
        error: (error: Error) => {
          expect(error.message).toBe(errorMessage);
          done();
        },
      });

      spectator
        .expectOne('/assets/response.json', HttpMethod.GET)
        .error(new ErrorEvent('Network error'));
    });
  });
});
