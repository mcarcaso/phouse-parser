export type char = string;

export interface PStream {
  head(): string;
  valid(): boolean;
  pos(): number;
  tail(): PStream;
  substring(end: PStream): string;
  value(): unknown;
  setValue(o: unknown): PStream;
}
