import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateResourceDto } from './create-resource.dto';
import { Resource } from './resource.model';

@Injectable()
export class ResourceService {
  private readonly resourceRepositoy: Repository<Resource>;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.resourceRepositoy = entityManager.getRepository(Resource);
  }

  async create(data: CreateResourceDto[]): Promise<boolean> {
    const resources: Resource[] = data.map(doc => {
      const resource = new Resource();
      resource.id = doc.id;
      resource.name = doc.name;
      resource.url = doc.url;
      return resource;
    });

    await this.resourceRepositoy.clear();
    await this.resourceRepositoy.save(resources);
    return true;
  }

  async list(): Promise<Resource[]> {
    return await this.resourceRepositoy.find();
  }

  async getResourcePermissions(): Promise<any> {
    const result = await this.resourceRepositoy.query(
      'SELECT r.*, p.name as permission FROM resources r LEFT JOIN permissions p ON r.id = p."resourceId"',
    );
    return result;
  }
}
