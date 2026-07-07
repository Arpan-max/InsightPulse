import { PipelineStepDef } from './types';
import {
  dropNaStep,
  fillNaStep,
  dropDuplicatesStep,
  renameColumnStep,
  selectColumnsStep,
  filterRowsStep,
  castTypeStep,
  sortValuesStep,
  groupByAggregateStep,
  addComputedColumnStep
} from './steps';

export const PIPELINE_STEPS: Record<string, PipelineStepDef> = {
  [dropNaStep.id]: dropNaStep,
  [fillNaStep.id]: fillNaStep,
  [dropDuplicatesStep.id]: dropDuplicatesStep,
  [renameColumnStep.id]: renameColumnStep,
  [selectColumnsStep.id]: selectColumnsStep,
  [filterRowsStep.id]: filterRowsStep,
  [castTypeStep.id]: castTypeStep,
  [sortValuesStep.id]: sortValuesStep,
  [groupByAggregateStep.id]: groupByAggregateStep,
  [addComputedColumnStep.id]: addComputedColumnStep,
};
