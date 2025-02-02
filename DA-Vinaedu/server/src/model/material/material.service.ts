import { Injectable } from '@nestjs/common';
import { SuccessResponse } from 'src/common/response';
import { SELECT_FILE } from 'src/database/prisma/prisma.helpers';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { FileService } from 'src/file/file.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto';

@Injectable()
export class MaterialService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async create(
    file: Express.Multer.File,
    body: CreateMaterialDto,
    userId: number,
  ) {
    const { classroomId, title, url } = body;

    let finalFileId = null;
    if (file) {
      const uploadedFiles = await this.fileService.upload([file]);
      finalFileId = uploadedFiles[0].id;
    }

    try {
      const material = await this.prisma.material.create({
        data: {
          classroom: { connect: { id: classroomId, ownerId: userId } },
          title,
          url,
          file: finalFileId ? { connect: { id: finalFileId } } : undefined,
        },
        include: { file: SELECT_FILE },
      });
      return material;
    } catch (error) {
      if (finalFileId) {
        this.fileService.delete([finalFileId]);
      }
      throw error;
    }
  }

  async findAllByClassroomId(classroomId: string, userId: number) {
    return this.prisma.material.findMany({
      where: {
        classroom: {
          id: classroomId,
          OR: [{ ownerId: userId }, { students: { some: { userId } } }],
        },
      },
      include: { file: SELECT_FILE },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    id: number,
    file: Express.Multer.File,
    body: UpdateMaterialDto,
    userId: number,
  ) {
    const { title, url } = body;

    const material = await this.prisma.material.findUniqueOrThrow({
      where: { id, classroom: { ownerId: userId } },
      include: { file: SELECT_FILE },
    });

    if (material.file) {
      this.fileService.delete([material.file.id]);
    }

    let finalFileId = null;
    if (file) {
      const uploadedFiles = await this.fileService.upload([file]);
      finalFileId = uploadedFiles[0].id;
    }

    try {
      const updatedMaterial = await this.prisma.material.update({
        where: { id },
        data: { title, url, file: { connect: { id: finalFileId } } },
        include: { file: SELECT_FILE },
      });
      return updatedMaterial;
    } catch (error) {
      if (finalFileId) {
        this.fileService.delete([finalFileId]);
      }
      throw error;
    }
  }

  async remove(id: number, userId: number) {
    await this.prisma.material.delete({
      where: { id, classroom: { ownerId: userId } },
    });
    return SuccessResponse;
  }
}
