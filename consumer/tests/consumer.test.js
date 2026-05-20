const { processActivity } = require('../src/services/activityProcessor');
const Activity = require('../src/models/activitySchema');

jest.mock('../src/models/activitySchema');

describe('Consumer Processor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should process and save a valid activity', async () => {
        const mockSave = jest.fn().mockResolvedValue();
        Activity.mockImplementation(() => ({
            save: mockSave
        }));

        const data = {
            id: 'test-123',
            userId: 'user-1',
            eventType: 'click',
            timestamp: '2023-10-27T10:00:00Z',
            payload: {}
        };

        const result = await processActivity(data);
        expect(result).toBe(true);
        expect(Activity).toHaveBeenCalledTimes(1);
        expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it('should handle duplicate id gently', async () => {
        const error = new Error('duplicate');
        error.code = 11000;
        
        const mockSave = jest.fn().mockRejectedValue(error);
        Activity.mockImplementation(() => ({
            save: mockSave
        }));

        const data = { id: 'test-456' };

        const result = await processActivity(data);
        expect(result).toBe(true);
    });
    
    it('should throw on other db errors', async () => {
        const error = new Error('db error');
        
        const mockSave = jest.fn().mockRejectedValue(error);
        Activity.mockImplementation(() => ({
            save: mockSave
        }));

        const data = { id: 'test-789' };

        await expect(processActivity(data)).rejects.toThrow('db error');
    });
});
