export const planLimits = {
  FREE: {
    agents: 0,
    calls_per_day: 0,
    minutes: 0,
    workflows: 0,
  },
  STARTER: {
    agents: 1,
    calls_per_day: 5,
    minutes: 200,
    workflows: 3,
  },
  PRO: {
    agents: 5,
    calls_per_day: 20,
    minutes: 1000,
    workflows: 10,
  },
  CUSTOM: {
    agents: 100,
    calls_per_day: 100,
    minutes: 3500,
    workflows: 50,
  },
};
