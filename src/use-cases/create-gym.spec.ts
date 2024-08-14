import { expect, beforeEach, describe, it } from "vitest";import { compare } from "bcryptjs";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-respository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  })

  it("should be able to create gym", async () => {
  
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -3.7912576,
      longitude: -38.551552,
    });


    expect(gym.id).toEqual(expect.any(String));
  });


});
