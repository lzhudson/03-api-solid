import { expect, beforeEach, describe, it, vi } from "vitest";
import { CheckInsRepository } from "@/repositories/checkins-repository";
import { CheckInUseCase } from "./checkin";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach } from "node:test";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-respository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: CheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check In Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    vi.useFakeTimers();
    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -3.7912576,
      longitude: -38.551552,
    })
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to register", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -3.7912576,
      userLongitude: -38.551552,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -3.7912576,
      userLongitude: -38.551552,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -3.7912576,
        userLongitude: -38.551552,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -3.7912576,
      userLongitude: -38.551552,
    });
    
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -3.7912576,
      userLongitude: -38.551552,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-3.7912576),
      longitude: new Decimal(-38.551552),
    })

    await expect(() => sut.execute({
      userId: "user-01",
      gymId: "gym-02",
      userLatitude: -3.7414571,
      userLongitude: -38.4532027,
    })).rejects.toBeInstanceOf(MaxDistanceError)
  });
});
