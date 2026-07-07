import { PipelineStepInstance } from './types';
import { PIPELINE_STEPS } from './registry';

export function runPipeline(data: any[], steps: PipelineStepInstance[]): { result: any[]; errors: Record<string, string> } {
  let currentData = [...data];
  const errors: Record<string, string> = {};

  for (const step of steps) {
    const stepDef = PIPELINE_STEPS[step.stepId];
    if (!stepDef) continue;

    try {
      currentData = stepDef.apply(currentData, step.config);
    } catch (e: any) {
      errors[step.instanceId] = e.message || 'Unknown error occurred in this step';
      // Stop processing further steps on failure, as requested by constraints.
      break; 
    }
  }

  return { result: currentData, errors };
}
