import { Test, TestingModule } from "@nestjs/testing";
import { ProjectService } from "../src/modules/organization/features/project/project.service";

describe("ProjectService", () => {
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
