import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import assert from 'node:assert/strict';
import test from 'node:test';
import * as bcrypt from 'bcryptjs';
import { User } from '../database/entities/user.entity';
import { AuthService } from './auth.service';

test('changePassword checks confirmation and current password before saving', async () => {
  const user = { id: 1, password: await bcrypt.hash('old-password', 4) } as User;
  let saves = 0;
  const users = {
    findOneByOrFail: async () => user,
    save: async () => { saves += 1; return user; },
  };
  const auth = new AuthService(users as never, {} as never, {} as never, {} as never, {} as never);

  await assert.rejects(() => auth.changePassword(1, 'old-password', 'new-password', 'different'), BadRequestException);
  await assert.rejects(() => auth.changePassword(1, 'wrong-password', 'new-password', 'new-password'), UnauthorizedException);
  await auth.changePassword(1, 'old-password', 'new-password', 'new-password');

  assert.equal(saves, 1);
  assert.equal(await bcrypt.compare('new-password', user.password), true);
});
