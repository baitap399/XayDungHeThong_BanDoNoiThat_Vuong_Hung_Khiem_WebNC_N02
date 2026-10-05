import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { vi } from 'vitest';
import { Monhoc } from '../monhoc/monhoc.entity.js';
import { Sinhvien } from '../sinhvien/sinhvien.entity.js';
import { Dangki } from './dangki.entity.js';
import { DangkiService } from './dangki.service.js';

const createRepositoryMock = () => ({
  findOneBy: vi.fn(),
  findOne: vi.fn(),
  save: vi.fn(),
});

describe('DangkiService', () => {
  let service: DangkiService;
  let dangkiRepository: ReturnType<typeof createRepositoryMock>;
  let sinhvienRepository: ReturnType<typeof createRepositoryMock>;
  let monhocRepository: ReturnType<typeof createRepositoryMock>;

  beforeEach(async () => {
    dangkiRepository = createRepositoryMock();
    sinhvienRepository = createRepositoryMock();
    monhocRepository = createRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DangkiService,
        { provide: getRepositoryToken(Dangki), useValue: dangkiRepository },
        { provide: getRepositoryToken(Sinhvien), useValue: sinhvienRepository },
        { provide: getRepositoryToken(Monhoc), useValue: monhocRepository },
      ],
    }).compile();

    service = module.get(DangkiService);
  });

  it('saves a registration for an existing student and course', async () => {
    const sinhVien = { id: 1 } as Sinhvien;
    const monHoc = { id: 2 } as Monhoc;
    const registration = { id: 3, sinhVien, monHoc } as Dangki;
    sinhvienRepository.findOneBy.mockResolvedValue(sinhVien);
    monhocRepository.findOneBy.mockResolvedValue(monHoc);
    dangkiRepository.findOne.mockResolvedValue(null);
    dangkiRepository.save.mockResolvedValue(registration);

    await expect(service.create({ sinhVienId: 1, monHocId: 2 })).resolves.toBe(
      registration,
    );
    expect(dangkiRepository.save).toHaveBeenCalledWith({ sinhVien, monHoc });
  });

  it('rejects duplicate registrations', async () => {
    sinhvienRepository.findOneBy.mockResolvedValue({ id: 1 });
    monhocRepository.findOneBy.mockResolvedValue({ id: 2 });
    dangkiRepository.findOne.mockResolvedValue({ id: 3 });

    await expect(
      service.create({ sinhVienId: 1, monHocId: 2 }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(dangkiRepository.save).not.toHaveBeenCalled();
  });

  it('rejects registrations for an unknown student', async () => {
    sinhvienRepository.findOneBy.mockResolvedValue(null);

    await expect(
      service.create({ sinhVienId: 99, monHocId: 2 }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(monhocRepository.findOneBy).not.toHaveBeenCalled();
  });
});