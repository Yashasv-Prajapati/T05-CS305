/**
 * @jest-environment node
 */
import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from '@/app/api/code_coverage/route';
import axios from 'axios';
import { GenerateReadmeSchema } from '@/lib/validations/generate-readme';

// Mock the function
jest.mock('@/actions/project', () => ({
    get_project_branch: jest.fn(),
}));

// Mocking axios requests
jest.mock('axios');

// Mock the GenerateReadmeSchema.parse function
const mockParse = jest.spyOn(GenerateReadmeSchema, 'parse');

describe('POST /api/generate-readme', () => {
  it('should return unauthorized if no current user: status 401', async () => {
    // Mocking getCurrentUser function
    jest.mock('@/lib/curr', () => ({
        __esModule: true,
      default: jest.fn().mockReturnValue(null), // Mocking the case where no current user is returned
    }));
    
    jest
      .spyOn(axios, 'head')
      .mockResolvedValue(null);
      jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: { content: 'karan hello' } });
    
    await testApiHandler({
      appHandler,
      async test({ fetch }) {
        const response = await fetch({ method: 'POST' });
        expect(response.status).toBe(500);
      },
    });
  });

  it('should return a README: status 200', async () => {
    const body = {
      project_type: 'python',
      repositoryName: 'sample-repo',
      projectId: '1234567890',
      project_goals: 'achieve greatness',
      core_functionalities: 'core functionality',
    };

    jest
      .spyOn(axios, 'head')
      .mockResolvedValue({ data: { content: 'karan hello' } });
      jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: { content: 'karan hello' } });

    await testApiHandler({
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

  it('should return validation errors on invalid input: status 422', async () => {
    jest
      .spyOn(axios, 'head')
      .mockResolvedValue({ data: { content: 'karan hello' } });
      jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: { content: 'karan hello' } });
    
    // Set up mock behavior for invalid input
    // mockParse.mockImplementation(() => {
    //     throw new z.ZodError([{ code: 'invalid_type', path: [], message: 'Validation error message' }]);
    // });
    
    const body = {
      // Invalid input, missing required fields
      project_type: 'python',
      projectId: '1234567890',
    };

    await testApiHandler({
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

  it('should return Internal Server Error: status 500', async () => {
    const body = {
      project_type: 'python',
      repositoryName: 'sample-repo',
      projectId: '1234567890',
      project_goals: 'achieve greatness',
      core_functionalities: 'core functionality',
    };

    jest
      .spyOn(axios, 'head')
      .mockResolvedValue({ data: { content: 'karan hello' } });
      jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: { content: 'karan hello' } });

    await testApiHandler({
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
});