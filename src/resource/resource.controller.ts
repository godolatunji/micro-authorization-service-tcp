import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateResourceDto } from './create-Resource.dto';
import { Resource } from './resource.model';
import { ResourceService } from './resource.service';

@Controller()
export class ResourceController {
  constructor(
    @Inject(ResourceService)
    private readonly resourceService: ResourceService,
  ) {}

  @MessagePattern({ cmd: 'listResources' })
  list(): Promise<Resource[]> {
    return this.resourceService.list();
  }

  @MessagePattern({ cmd: 'createResource' })
  create(createResourceDto: CreateResourceDto[]): Promise<boolean> {
    return this.resourceService.create(createResourceDto);
  }
}
