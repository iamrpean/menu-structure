import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
    constructor(private prisma: PrismaService) { }

    async create(createMenuDto: CreateMenuDto): Promise<Menu> {
        return this.prisma.menu.create({
            data: {
                name: createMenuDto.name,
                parentId: createMenuDto.parentId,
            },
        });
    }

    // async findAll(): Promise<Menu[]> {
    //     return this.prisma.menu.findMany({
    //         where: { parentId: null },
    //         include: {
    //             children: {
    //                 include: {
    //                     children: true, 
    //                 },
    //             },
    //         },
    //     });
    // }

    async findAll(): Promise<Menu[]> {
        const allMenus = await this.prisma.menu.findMany();
    
        const buildMenuTree = (parentId: number | null): Menu[] => {
            return allMenus
                .filter(menu => menu.parentId === parentId)
                .map(menu => ({
                    ...menu,
                    children: buildMenuTree(menu.id), 
                }));
        };
    
        return buildMenuTree(null);
    }

    async findOne(id: number): Promise<Menu> {
        const menu = await this.prisma.menu.findUnique({
            where: { id },
            include: {
                children: {
                    include: {
                        children: true,
                    },
                },
            },
        });

        if (!menu) {
            throw new NotFoundException(`Menu with ID ${id} not found`);
        }

        return menu;
    }

    async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
        return this.prisma.menu.update({
            where: { id },
            data: {
                name: updateMenuDto.name
            },
        });
    }

    async remove(id: number): Promise<void> {
        await this.prisma.menu.delete({
            where: { id },
        });
    }
}