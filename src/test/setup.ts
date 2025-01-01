import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from '../shared/services/prisma.services';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

let app: INestApplication;
let prisma: PrismaService;

export const setupTestApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  prisma = app.get(PrismaService);

  await app.init();

  return app;
};

export const resetDatabase = async () => {
  if (!prisma) throw new Error('PrismaService is not initialized');
  await prisma.$executeRaw`TRUNCATE TABLE "Order", "ChatRoom", "Message", "User" RESTART IDENTITY CASCADE;`;
};

export const closeTestApp = async () => {
  await prisma.$disconnect();
  await app.close();
};
