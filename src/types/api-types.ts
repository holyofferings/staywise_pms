export type ActionStatus = "success" | "error";

export type ActionResponse<T = any> = {
  status: ActionStatus;
  message: string;
  data?: T;
};

export type CustomerStatus = "lead" | "prospect" | "customer" | "churned";

export type DealStage = "initial" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost"; 