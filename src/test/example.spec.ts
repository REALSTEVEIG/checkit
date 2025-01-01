import { PrismaService } from '@shared/services/prisma.services';

describe('Example Test', () => {
  it('should import successfully', () => {
    const service = new PrismaService();
    expect(service).toBeDefined();
  });
});
