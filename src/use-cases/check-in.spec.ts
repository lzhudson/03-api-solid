import { expect, beforeEach, describe, it } from "vitest";
import { CheckInsRepository } from "@/repositories/checkins-repository";
import { CheckInUseCase } from "./checkin";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: CheckInsRepository;
let sut: CheckInUseCase;

describe("Check In Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository);
  })

  it("should be able to register", async () => {
  
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01'
    });


    expect(checkIn.id).toEqual(expect.any(String));
  });
});
