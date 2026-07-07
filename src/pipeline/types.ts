import React from 'react';

export interface PipelineStepDef<T = any> {
  id: string;
  label: string;
  renderConfig: React.FC<{ config: T; onChange: (config: T) => void; columns: string[] }>;
  apply: (data: any[], config: T) => any[];
  defaultConfig: T;
}

export interface PipelineStepInstance {
  instanceId: string;
  stepId: string;
  config: any;
  error?: string;
}
