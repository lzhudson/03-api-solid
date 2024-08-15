import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/checkins-repository";

interface FetchUserCheckInsHistoryUseCaseCaseRequest {
  userId: string;
  page: number
}

interface FetchUserCheckInsHistoryUseCaseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCaseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page);
    return {
      checkIns,
    };
  }
}
