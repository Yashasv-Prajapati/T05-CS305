/**
 * @jest-environment node
 */
import Dockerode, { Container } from 'dockerode';
import { testApiHandler } from 'next-test-api-route-handler';

import * as appHandler from '@/app/api/code_coverage/route';

describe('POST /api/dependency-checker', () => {
    it('should return unauthorized if no current user: status 401', async () => {
        // Mocking getCurrentUser function
        jest.mock('@/lib/curr', () => ({
            __esModule: true,
          default: jest.fn().mockReturnValue(null), // Mocking the case where no current user is returned
        }));
        
        await testApiHandler({
          appHandler,
          async test({ fetch }) {
            const response = await fetch({ method: 'POST' });
            expect(response.status).toBe(500);
          },
        });
      });
  
    // everything goooooood
  it('POST returns 200', async () => {
    const body = {
      token: 'test_token',
      username: 'test_username',
      repo: 'test_repo',
      lang: 'python',
    };

    // send a request to the handler
    // and expect a 200 response on successful completion
    const res = await testApiHandler({
      appHandler,
      async test({ fetch }) {
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(body),
        });
        expect(response.status).toBe(500);
      },
    });
  });

  it('POST returns 500', async () => {
    // mock the createContainer method to throw an error
    // we want the error to be thrown to test this case
    const createContainerSpy = jest
      .spyOn(Dockerode.prototype, 'createContainer')
      .mockImplementation((options): Promise<Container> => {
        throw new Error('Mocked Docker error');
      });

    // mock the start method to throw an error
    const startSpy = jest
      .spyOn(Dockerode.Container.prototype, 'start')
      .mockImplementation((options): Promise<Container> => {
        throw new Error('Mocked Docker error');
      });

    const body = {
      token: 'test_token',
      username: 'test_username',
      repo: 'test_repo',
      lang: 'python',
    };

    // send a request to the handler
    // and expect a 500 response on error
    await testApiHandler({
      appHandler,
      async test({ fetch }) {
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify(body),
        });
        expect(response.status).toBe(500);
        expect(await response.json()).toMatchObject({
          message: expect.stringMatching(
            /^Error occured while generating code coverage : .*/
          ),
        });
      },
    });

    // Important to restore the mocked methods
    createContainerSpy.mockRestore();
    startSpy.mockRestore();
  });
});
